import fs from 'fs-extra'
import path from 'node:path'
import { glob } from 'glob'
import ts from 'typescript'

import { loadConfig } from './helpers/index.js'

import { basePlugin, replacePlugin, vuePlugin } from './plugins/index.js'

let fileOptions = {}

loadConfig().then((configs) => {
  fileOptions = configs
})

/**
 * Cleants 类用于将 TypeScript 项目转换为 JavaScript 项目。
 */
class Cleants {
  /**
   * @param {string} inputDir - 输入目录路径。
   * @param {string} outputDir - 输出目录路径。
   * @param {Object} [options] - 可选配置选项。
   * @param {Function} [options.progressCallback] - 进度回调函数。
   * @param {Object} [options.compilerOptions] - TypeScript 编译选项。
   * @param {Array<string|RegExp|Function>} [options.ignoredCopyPatterns] - 忽略复制的模式。
   * @param {Array<string|RegExp|Function>} [options.ignoredConversionPatterns] - 忽略转换的模式。
   * @param {Function} [options.getOutputDir] - 获取输出目录的函数。
   * @param {Array<string>} [options.removeDependencies] - 要移除的依赖项。
   * @param {boolean} [options.replaceInternalImports] - 是否替换内部导入。
   */
  constructor(inputDir, outputDir, options = {}) {
    this.options = {
      compilerOptions: {},
      ignoredCopyPatterns: [
        'node_modules',
        '.git',
        'dist',
        /\.d\.ts$/,
        file => file.endsWith('.log'),
      ],
      ignoredConversionPatterns: [
        'vendor',
        /\.min\.js$/,
        file => file.includes('legacy'),
      ],
      getOutputDir: inputDir => `${path.basename(inputDir)}.cleants`,
      removeDependencies: ['typescript', 'vue-tsc', '@types/node'],
      replaceInternalImports: false,
      progressCallback: () => false,
      plugins: [basePlugin, vuePlugin],
      ...fileOptions,
      ...options,
    }

    this.inputDir = inputDir ?? this.options.inputDir
    this.outputDir = outputDir ?? this.options.outputDir

    this.progressCallback = this.options.progressCallback
    this.plugins = this.options.plugins

    this.hooks = {
      beforeConvert: this.options.hooks?.beforeConvert || (() => false),
      afterConvert: this.options.hooks?.afterConvert || (() => false),
    }

    this.actualOutputDir = path.join(this.outputDir, this.options.getOutputDir(this.inputDir))

    if (this.options.replaceInternalImports) {
      this.plugins.unshift(replacePlugin)
    }
  }

  /**
   * 开始转换过程。
   * @returns {Promise<void>}
   */
  async run() {
    this.progressCallback({ stage: 'start', progress: 0 })

    await this.copyFiles()
    this.progressCallback({ stage: 'copy', progress: 20 })

    await this.processFiles()
    this.progressCallback({ stage: 'converting', progress: 60 })

    await this.updateConfig()
    await this.updatePackage()

    this.progressCallback({ stage: 'complete', progress: 100 })
  }

  /**
   * 复制项目文件到输出目录。
   * @returns {Promise<void>}
   */
  async copyFiles() {
    const filter = (src) => {
      const relativePath = path.relative(this.inputDir, src)
      return !this.options.ignoredCopyPatterns.some(pattern =>
        this.matchesPattern(relativePath, pattern),
      )
    }
    await fs.copy(this.inputDir, this.actualOutputDir, { filter })
  }

  /**
   * 转换文件。
   * @returns {Promise<void>}
   */
  async processFiles() {
    const files = await this.getFilesToConvert()
    const totalFiles = files.length

    const shouldIgnore = file => this.options.ignoredConversionPatterns.some(pattern => this.matchesPattern(file, pattern))

    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      await this.convertFile(file, index, totalFiles, shouldIgnore)
    }
  }

  /**
   * 获取需要转换的文件列表。
   * @returns {Promise<string[]>} - 转换文件的路径数组。
   */
  async getFilesToConvert() {
    const extensions = [...new Set(this.plugins.map(plugin => plugin().extensions).flat())]

    const files = await glob(`**/*{${extensions.join(',')}}`, { cwd: this.actualOutputDir })

    return files
  }

  /**
   * 转换单个文件。
   * @param {string} file - 文件路径。
   * @returns {Promise<void>}
   */
  async convertFile(file, index, totalFiles, shouldIgnore) {
    if (shouldIgnore(file))
      return

    const filePath = path.join(this.actualOutputDir, file)
    const content = await fs.readFile(filePath, 'utf-8')

    const finalContent = await this.processFile(file, content)

    await this.hooks.beforeConvert(file, finalContent, this)

    await this.writeFile(file, finalContent)

    await this.hooks.afterConvert(file, finalContent, this)

    this.progressCallback({
      stage: 'convert',
      progress: 20 + Math.floor(60 * (index + 1) / totalFiles),
      currentFile: file,
    })
  }

  /**
   * 运行插件以处理文件内容。
   * @param {string} file - 文件路径。
   * @param {string} content - 文件内容。
   * @returns {Promise<string>} - 转换后的内容。
   */
  async processFile(file, content) {
    const ext = path.extname(file)

    let processContent = content

    for (const plugin of this.plugins) {
      const { extensions, processFile } = plugin()

      if (extensions.includes(ext) && processFile) {
        processContent = await processFile(file, processContent, this)
      }
    }

    return processContent
  }

  /**
   * 运行插件以写入文件内容。
   * @param {string} file - 文件路径。
   * @param {string} content - 文件内容。
   * @returns {Promise<void>}
   */
  async writeFile(file, content) {
    const ext = path.extname(file)

    for (const plugin of this.plugins) {
      const { extensions, writeFile } = plugin()

      if (extensions.includes(ext) && writeFile) {
        await writeFile(file, content, this)
      }
    }
  }

  /**
   * 转换 TypeScript 内容为 JavaScript。
   * @param {string} content - TypeScript 内容。
   * @param {string} [fileExtension] - 文件扩展名。
   * @returns {string} - 转换后的 JavaScript 内容。
   */
  transpileFile(content, fileExtension = '.ts') {
    const { outputText } = ts.transpileModule(content, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.Preserve,
        removeComments: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        verbatimModuleSyntax: true,
        ...this.options.compilerOptions,
      },
      fileName: `temp${fileExtension}`,
    })

    return outputText
  }

  /**
   * 检查文件是否匹配给定模式。
   * @param {string} file - 文件路径。
   * @param {string|RegExp|Function} pattern - 匹配模式。
   * @returns {boolean} - 是否匹配。
   */
  matchesPattern(file, pattern) {
    if (pattern instanceof RegExp) {
      return pattern.test(file)
    }
    if (typeof pattern === 'function') {
      return pattern(file)
    }
    return file === pattern || file.startsWith(pattern)
  }

  /**
   * 更新配置文件。
   * @returns {Promise<void>}
   */
  async updateConfig() {
    this.convertTsConfig()
  }

  /**
   * 转换 TypeScript 配置文件为 JavaScript 配置文件。
   * @returns {Promise<void>}
   */
  async convertTsConfig() {
    const tsconfigPath = path.join(this.actualOutputDir, 'tsconfig.json')
    const jsconfigPath = path.join(this.actualOutputDir, 'jsconfig.json')

    if (await fs.pathExists(tsconfigPath)) {
      const tsconfig = await fs.readJson(tsconfigPath)
      const jsconfig = this.convertToJsConfig(tsconfig)
      await fs.writeJson(jsconfigPath, jsconfig, { spaces: 2 })
      await fs.remove(tsconfigPath)
    }
  }

  /**
   * 将 TypeScript 配置转换为 JavaScript 配置。
   * @param {Object} tsconfig - 原始 TypeScript 配置对象。
   * @returns {Object} - 转换后的 JavaScript 配置对象。
   */
  convertToJsConfig(tsconfig) {
    const jsconfig = { ...tsconfig }
    if (jsconfig.compilerOptions) {
      delete jsconfig.compilerOptions.strict
      delete jsconfig.compilerOptions.noImplicitAny
      delete jsconfig.compilerOptions.strictNullChecks
      delete jsconfig.compilerOptions.strictFunctionTypes
      delete jsconfig.compilerOptions.strictBindCallApply
      delete jsconfig.compilerOptions.strictPropertyInitialization
      delete jsconfig.compilerOptions.noImplicitThis
      delete jsconfig.compilerOptions.alwaysStrict
    }
    return jsconfig
  }

  /**
   * 更新 package.json 文件。
   * @returns {Promise<void>}
   */
  async updatePackage() {
    const packageJsonPath = path.join(this.actualOutputDir, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)

      // 移除指定的依赖项
      this.options.removeDependencies.forEach((dep) => {
        delete packageJson?.dependencies?.[dep]
        delete packageJson?.devDependencies?.[dep]
      })

      // 更新 scripts
      if (packageJson.scripts) {
        Object.keys(packageJson.scripts).forEach((scriptName) => {
          packageJson.scripts[scriptName] = packageJson.scripts[scriptName]
            .replace(/vue-tsc/g, '')
            .replace(/tsc/g, '')
            .replace(/\s+&&\s+/g, ' && ')
            .trim()
        })
      }

      // 移除 types 字段
      delete packageJson.types

      // 写回更新后的 package.json
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
    }
  }
}

export default Cleants

import path from 'node:path'
import fs from 'fs-extra'
import vueCompiler from '@vue/compiler-sfc'
import { hasScriptTag, updateScriptAttrs } from '../../helpers/index.js'

export const vuePlugin = () => ({
  extensions: ['.vue'],

  processFile: async (file, content, ctx) => {
    if (!content || !hasScriptTag(content)) {
      return content
    }

    const { descriptor } = vueCompiler.parse(content)

    const script = descriptor.scriptSetup || descriptor.script

    if (!script) {
      return updateScriptAttrs(content, { lang: void 0 })
    }

    const scriptContent = script.content

    const lang = script.lang || 'js'

    const replaceLang = lang === 'tsx' ? 'jsx' : void 0

    let processContent = ['ts', 'tsx'].includes(lang)
      ? `\n${ctx.transpileFile(scriptContent, `.${lang}`)}`
      : scriptContent

    processContent = content.replace(script.content, processContent)

    processContent = updateScriptAttrs(processContent, { lang: replaceLang })

    // TODO 在 .vue 文件中需要去除ts编译器生成的冗余的导出
    processContent = processContent.replaceAll('export {};', '')

    return processContent
  },

  writeFile: async (file, content, ctx) => {
    const filePath = path.join(ctx.actualOutputDir, file)
    await fs.writeFile(filePath, content)
  },
})

export default vuePlugin

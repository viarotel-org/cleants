import path from 'node:path'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'

import { extensionMap } from '../constants/index.js'

/**
 * 检查给定内容中是否包含 <script> 标签。
 *
 * @param {string} content - 要检查的 HTML 内容。
 * @returns {boolean} 如果内容中包含 <script> 标签，则返回 true；否则返回 false。
 */
export function hasScriptTag(content) {
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>/i

  return regex.test(content)
}

/**
 * 更新给定内容中所有 <script> 标签的属性。
 *
 * @param {string} content - 包含 <script> 标签的 HTML 内容。
 * @param {Object} attrsToUpdate - 要更新的属性及其新值的对象，键为属性名，值为新值。
 * @returns {string} 更新后的 HTML 内容，其中 <script> 标签的属性已被更新。
 */
export function updateScriptAttrs(content, attrsToUpdate) {
  const scriptRegex = /<script\b([^>]*)>/gi

  return content.replace(scriptRegex, (match, attrs) => {
    const updatedAttrs = new Map(
      attrs
        .trim()
        .split(/\s+/)
        .map((attr) => {
          const [name, ...valueParts] = attr.split('=')
          const value = valueParts.join('=')
          return [name, value ? value.replace(/^["']|["']$/g, '') : '']
        }),
    )

    for (const [name, value] of Object.entries(attrsToUpdate)) {
      if (value !== undefined) {
        updatedAttrs.set(name, value)
      }
      else {
        updatedAttrs.delete(name)
      }
    }

    const attrString = Array.from(updatedAttrs)
      .map(([name, value]) => (value ? `${name}="${value}"` : name))
      .join(' ')

    return `<script${attrString ? ` ${attrString}` : ''}>`
  })
}

/**
 * 替换文件后缀
 * @param {*} text
 * @param {*} ext
 * @returns {boolean}
 */
export function replaceTsImports(text, inputExt = '.ts', outputExt = '.js') {
  const regex = new RegExp(`\\.${inputExt.slice(1)}(['"])`, 'g')

  return text.replace(regex, `${outputExt}$1`)
}

/**
 * 获取新的文件路径
 * @param {*} filePath
 * @returns
 */
export function getNewFilePath(filePath) {
  const ext = path.extname(filePath)

  if (!extensionMap[ext]) {
    return filePath
  }

  return filePath.replace(ext, extensionMap[ext])
}

/**
 * 将字符串首字母转为大写
 * @param {*} str
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
  if (!str)
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 加载当前工作目录下的 cleants.config.js 配置文件。
 *
 * @param configFileName 加载的配置文件名称
 * @async
 * @function loadConfig
 * @returns {Promise<Object>} 返回配置对象。如果配置文件不存在，返回空对象或默认配置。
 * @throws {Error} 如果加载配置文件时发生错误，抛出异常。
 *
 * @example
 * (async () => {
 *     const config = await loadConfig();
 *     console.log('加载的配置:', config);
 * })();
 */
export async function loadConfig(configFileName = 'cleants.config.js') {
  const configFilePath = path.join(process.cwd(), process.env.CLEANTS_CONFIG_DIR || '', configFileName)

  try {
    // 检查配置文件是否存在
    const fileExists = await fs.pathExists(configFilePath)

    if (!fileExists) {
      return {}
    }

    // 动态导入配置文件
    const configFileUrl = pathToFileURL(configFilePath).href

    const config = await import(configFileUrl)

    // 返回配置内容，确保导出为默认
    return config.default || config
  }
  catch (error) {
    return {}
  }
}

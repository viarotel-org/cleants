import path from 'node:path'
import fs from 'fs-extra'
import { pathToFileURL } from 'node:url'

import { extensionMap } from '../constants/index.js'

export function hasScriptTag(content) {
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>|<script\b[^>]*\/>/i

  return regex.test(content)
}

export function updateScriptAttrs(content, attrsToUpdate) {
  // 创建正则表达式以匹配 <script> 标签及其属性
  const scriptRegex = /<script([^>]*)>/g

  // 替换 <script> 标签中的属性
  const updatedContent = content.replace(scriptRegex, (match, attrs) => {
    // 将属性字符串分割为单个属性
    const attributes = attrs.trim().split(/\s+/)

    // 更新指定的属性
    const updatedAttrs = attributes.map((attr) => {
      const [attrName, attrValue] = attr.split('=')
      if (attrsToUpdate[attrName]) {
        return `${attrName}="${attrsToUpdate[attrName]}"` // 更新属性值
      }
      return attr // 保留未更新的属性
    })

    // 重新构建 <script> 标签
    return `<script ${updatedAttrs.join(' ')}>`
  })

  return updatedContent
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
  const configFilePath = path.join(process.cwd(), configFileName)

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

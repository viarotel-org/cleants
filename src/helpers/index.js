import path from 'node:path'
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

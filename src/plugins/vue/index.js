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
      return updateScriptAttrs(content, { lang: 'js' })
    }

    const scriptContent = script.content

    const lang = script.lang || 'js'

    const replaceLang = lang === 'tsx' ? 'jsx' : 'js'

    let processContent = ['ts', 'tsx'].includes(lang)
      ? `\n${ctx.transpileFile(scriptContent, `.${lang}`)}`
      : scriptContent

    processContent = content.replace(script.content, processContent)

    processContent = updateScriptAttrs(processContent, { lang: replaceLang })

    return processContent
  },

  writeFile: async (file, content, ctx) => {
    const filePath = path.join(ctx.actualOutputDir, file)
    await fs.writeFile(filePath, content)
  },
})

export default vuePlugin

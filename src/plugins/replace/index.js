import path from 'node:path'
import fs from 'fs-extra'

import { extensionMap } from '../../constants/index.js'
import { replaceTsImports } from '../../helpers/index.js'

export const replacePlugin = () => ({
  extensions: ['.html', '.vue', '.ts', '.tsx', '.mts', '.cts'],

  processFile: async (file, content, ctx) => {
    let processContent = content

    for (const ext of Object.keys(extensionMap)) {
      processContent = replaceTsImports(processContent, ext, extensionMap[ext])
    }

    return processContent
  },

  writeFile: async (file, content, ctx) => {
    const filePath = path.join(ctx.actualOutputDir, file)

    await fs.writeFile(filePath, content)
  },
})

export default replacePlugin

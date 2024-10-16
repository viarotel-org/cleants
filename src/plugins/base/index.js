import path from 'node:path'
import fs from 'fs-extra'

import { extensionMap } from '../../constants/index.js'
import { getNewFilePath } from '../../helpers/index.js'

export const basePlugin = () => ({
  extensions: Object.keys(extensionMap),

  processFile: async (file, content, ctx) => {
    const processFContent = ctx.transpileFile(content, path.extname(file))

    return processFContent
  },

  writeFile: async (file, content, ctx) => {
    const filePath = path.join(ctx.actualOutputDir, file)
    const newFilePath = getNewFilePath(filePath)

    await fs.writeFile(newFilePath, content)

    if (filePath !== newFilePath) {
      await fs.remove(filePath)
    }
  },
})

export default basePlugin

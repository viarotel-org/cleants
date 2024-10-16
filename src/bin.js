#!/usr/bin/env node

import Cleants from './index.js'

import { defineCommand, runMain } from 'citty'

import { description, name, version } from '../package.json'

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  args: {
    inputDir: {
      type: 'positional',
      description: 'TypeScript project directory to convert',
      required: true,
    },
    outputDir: {
      type: 'positional',
      description: 'Output project directory',
      required: true,
    },
    replaceInternalImports: {
      type: 'boolean',
      description: 'Whether to automatically replace the suffix of inline imports?',
      default: true,
    },
  },
  async run({ args }) {
    const cleants = new Cleants(args.inputDir, args.outputDir)
    await cleants.convert()
  },
})

runMain(main)

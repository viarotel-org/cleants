#!/usr/bin/env node

import Cleants from './index.js'
import { capitalizeFirstLetter } from './helpers/index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as p from '@clack/prompts'
import { description, name, version } from '../package.json'
import ora from 'ora'

yargs(hideBin(process.argv))
  .command('$0', description, () => {}, async (argv) => {
    p.intro(`${capitalizeFirstLetter(name)}: ${description}. Supported by Viarotel v${version}`)

    const inputDir = await p.text({
      message: 'Enter the TypeScript project directory to convert:',
      validate: value => value.trim() === '' ? 'This field is required' : undefined,
    })

    const outputDir = await p.text({
      message: 'Enter the output project directory:',
      validate: value => value.trim() === '' ? 'This field is required' : undefined,
      initialValue: './',
    })

    const replaceInternalImports = await p.confirm({
      message: 'Automatically replace the suffix of inline imports?',
      initialValue: true,
    })

    if (p.isCancel(inputDir) || p.isCancel(outputDir) || p.isCancel(replaceInternalImports)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }

    const spinner = ora('Converting project...').start()

    try {
      const progressCallback = ({ stage, progress }) => {
        spinner.text = `${stage}: ${progress.toFixed(2)}%`
      }

      const cleants = new Cleants(inputDir, outputDir, { progressCallback })

      await cleants.convert()

      spinner.succeed('Conversion completed successfully!')
    }
    catch (error) {
      spinner.fail('An error occurred during conversion')
      p.log.error(error.message)
      process.exit(1)
    }

    p.outro('Thank you for using Cleants!')
  })
  .version(version)
  .help()
  .argv

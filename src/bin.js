#!/usr/bin/env node
import Cleants from './index.js'
import { capitalizeFirstLetter, loadConfig } from './helpers/index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as p from '@clack/prompts'
import { description, name, version } from '../package.json'
import ora from 'ora'

function runCommand() {
  yargs(hideBin(process.argv))
    .command('$0', description, () => {}, async (argv) => {
      p.intro(`${capitalizeFirstLetter(name)}: ${description}. Supported by Viarotel v${version}`)

      const { _: io, $0, ...cleantsOptions } = argv

      const fileOptions = await loadConfig()

      let inputDir = io[0] || fileOptions.inputDir
      let outputDir = io[1] || fileOptions.outputDir

      inputDir = await p.text({
        message: 'Enter the TypeScript project directory to convert:',
        validate: value => value.trim() === '' ? 'This field is required' : undefined,
        initialValue: inputDir,
      })

      outputDir = await p.text({
        message: 'Enter the output project directory:',
        validate: value => value.trim() === '' ? 'This field is required' : undefined,
        initialValue: outputDir || './',
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

        const cleants = new Cleants(inputDir, outputDir, { progressCallback, ...cleantsOptions })

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
}

runCommand()

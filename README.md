# Cleants

<!-- automd:badges -->

[![npm version](https://img.shields.io/npm/v/cleants)](https://npmjs.com/package/cleants)
[![npm downloads](https://img.shields.io/npm/dm/cleants)](https://npm.chart.dev/cleants)

<!-- /automd -->

> 🧹 Convert TypeScript to a cleaner JavaScript project

## Features

- 🖖 Vue-First: Priority support for Vue project conversion
- 🔌 Extensible: Plugin system for supporting various file types
- ⚡ Lightning Fast: Utilizes ts.transpileModule for rapid transpilation
- 🖥️ User-Friendly CLI: Quick conversion with a single command
- 🧩 Seamless Integration: Import as an npm package for easy project integration
- 🛠️ Customizable: Fine-tune the conversion process with flexible options
- 📊 Progress Tracking: Real-time feedback on conversion status
- 🎯 Selective Conversion: Ignore specific patterns during copy and conversion
- 📦 Dependency Management: Option to remove specified dependencies
- 🔄 Import Optimization: Capability to replace internal imports

## Install

```shell
npm install cleants
# or
yarn add cleants
# or
pnpm add cleants
```

## Usage

CLI Usage

```shell
npx cleants
```

Programmatic Usage

```javascript
import { Cleants } from 'cleants'

const cleaner = new Cleants(inputDir, outputDir, options)
await cleaner.run()
```

## API

### `Cleants`

The main class used to convert a TypeScript project into a cleaner JavaScript project.

#### Constructor

```typescript
constructor(inputDir: string, outputDir: string, options?: CleantsOptions)
```

##### Parameters

- `inputDir: string` - The input directory path
- `outputDir: string` - The output directory path
- `options?: CleantsOptions` - Optional configuration options

#### CleantsOptions

##### `progressCallback?: Function`
Progress callback function.
Default: `undefined`

##### `compilerOptions?: Object`
TypeScript compiler options.
Default: `{}`

##### `ignoredCopyPatterns?: Array<string | RegExp | Function>`
Patterns to ignore during the copy phase.
Default:
```javascript
[
  'node_modules',
  '.git',
  'dist',
  /\.d\.ts$/,
  file => file.endsWith('.log')
]
```

##### `ignoredConversionPatterns?: Array<string | RegExp | Function>`
Patterns to ignore during the conversion phase.
Default:
```javascript
[
  'vendor',
  /\.min\.js$/,
  file => file.includes('legacy')
]
```

##### `getOutputDir?: Function`
Function to get the output directory.
Default: `` inputDir => `${path.basename(inputDir)}.cleants` ``

##### `removeDependencies?: Array<string>`
Dependencies to remove.
Default: `['typescript', 'vue-tsc', '@types/node']`

##### `replaceInternalImports?: boolean`
Whether to replace internal imports.
Default: `true`

##### `plugins?: Array<Plugin>`
List of plugins to use.
Default: `[basePlugin, vuePlugin]`

#### Notice

- `actualOutputDir` is set to `path.join(outputDir, options.getOutputDir(inputDir))`
- If no `options.plugins` are provided, the default is `[basePlugin, vuePlugin]`

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/viarotel-org/cleants/issues).

## Support

If you find this project helpful for your work or study, please consider starring the project or buying me a cup of coffee through the links below:

<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/zh-CN/viarotel-wepay.jpg" alt="viarotel-wepay" width="30%">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/zh-CN/viarotel-alipay.jpg" alt="viarotel-alipay" width="30%">
  <a href="https://www.paypal.com/paypalme/viarotel" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/en-US/viarotel-paypal.png" alt="viarotel-paypal" width="30%">
  </a>
</div>

## Contributors

Thanks for all their contributions!

<a href="https://github.com/viarotel-org/cleants/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=viarotel-org/cleants" alt="contributors" />
</a>

## 📚 Keywords
`typescript` `javascript` `converter` `electron` `vue`

## License

This project is licensed under the [MIT](LICENSE) License.

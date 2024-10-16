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

```bash
npm install cleants
# or
yarn add cleants
# or
pnpm add cleants
```

## Usage

CLI Usage

```bash
npx cleants
```

Programmatic Usage

```javascript
import { Cleants } from 'cleants'

const cleaner = new Cleants(inputDir, outputDir, options)
await cleaner.run()
```

当然，我可以为您将该 JSDoc 转换为简洁美观的 Markdown 格式。以下是转换后的 API 文档：

## API

### `Cleants`

主要类，用于将 TypeScript 项目转换为更清洁的 JavaScript 项目。

#### 构造函数

```typescript
constructor(inputDir: string, outputDir: string, options?: CleantsOptions)
```

##### 参数

- `inputDir: string` - 输入目录路径
- `outputDir: string` - 输出目录路径
- `options?: CleantsOptions` - 可选配置选项

##### CleantsOptions

| 选项                         | 类型                                  | 描述                  |
| ---------------------------- | ------------------------------------- | --------------------- |
| `progressCallback?`          | `Function`                            | 进度回调函数          |
| `compilerOptions?`           | `Object`                              | TypeScript 编译器选项 |
| `ignoredCopyPatterns?`       | `Array<string \| RegExp \| Function>` | 复制时要忽略的模式    |
| `ignoredConversionPatterns?` | `Array<string \| RegExp \| Function>` | 转换时要忽略的模式    |
| `getOutputDir?`              | `Function`                            | 获取输出目录的函数    |
| `removeDependencies?`        | `Array<string>`                       | 要移除的依赖项        |
| `replaceInternalImports?`    | `boolean`                             | 是否替换内部导入      |

## Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/viarotel-org/cleants/issues).

## Support

If you feel that this project is helpful for your work or study, please help me order a ✨ Star, which will be a great encouragement and support for me, or you can buy me a cup of coffee below

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

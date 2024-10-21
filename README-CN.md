# Cleants

[![npm 版本](https://img.shields.io/npm/v/cleants)](https://npmjs.com/package/cleants)
[![npm 下载量](https://img.shields.io/npm/dm/cleants)](https://npm.chart.dev/cleants)

> 🧹 将 TypeScript 转换为更简洁的 JavaScript 项目

## 功能

- 🖖 **Vue 优先**：优先支持 Vue 项目转换
- 🔌 **可扩展**：通过插件系统支持多种文件类型
- ⚡ **极致快速**：使用 `ts.transpileModule` 进行快速编译
- 🖥️ **用户友好的 CLI**：一条命令快速转换
- 🧩 **无缝集成**：作为 npm 包导入，轻松集成到项目中
- 🛠️ **可自定义**：通过灵活的选项微调转换过程
- 📊 **进度追踪**：实时反馈转换状态
- 🎯 **选择性转换**：在复制和转换过程中忽略特定模式
- 📦 **依赖管理**：可选择移除指定依赖
- 🔄 **导入优化**：支持替换内部导入

## 安装

```shell
npm install cleants
# 或
yarn add cleants
# 或
pnpm add cleants
```

## 使用方法

### CLI 使用方法

```shell
npx cleants
```

### 编程使用方法

```javascript
import { Cleants } from 'cleants'

const cleaner = new Cleants(inputDir, outputDir, options)
await cleaner.run()
```

### 外部配置文件

> 你可以在执行命令目录下添加 `cleants.config.js` 文件来指定更多配置

```javascript
module.exports = {
  inputDir: 'D:\\Projects\\demo',
  outputDir: 'C:\\Users\\viarotel\\Downloads',
  compilerOptions: {},
  ignoredCopyPatterns: [
    '.git',
    'dist',
    /\.d\.ts$/,
    file => file.includes('node_modules'),
    file => file.endsWith('.log')
  ],
  ignoredConversionPatterns: [
    'vendor',
    /\.min\.js$/,
    file => file.includes('legacy')
  ],
  getOutputDir: inputDir => `${path.basename(inputDir)}.cleants`,
  removeDependencies: ['typescript', 'vue-tsc', '@types/node'],
  replaceInternalImports: true,
  plugins: []
}
```

## API

### `Cleants`

该类是将 TypeScript 项目转换为更简洁的 JavaScript 项目的主要类。

#### 构造函数

`constructor(inputDir: string, outputDir: string, options?: CleantsOptions)`

##### 参数

- `inputDir: string` - 输入目录路径
- `outputDir: string` - 输出目录路径
- `options?: CleantsOptions` - 可选配置选项

#### CleantsOptions

##### `progressCallback?: Function`
进度回调函数。
默认值：`undefined`

##### `compilerOptions?: Object`
TypeScript 编译器选项。
默认值：`{}`

##### `ignoredCopyPatterns?: Array<string | RegExp | Function>`
在复制阶段要忽略的模式。
默认值：
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
在转换阶段要忽略的模式。
默认值：
```javascript
[
  'vendor',
  /\.min\.js$/,
  file => file.includes('legacy')
]
```

##### `getOutputDir?: Function`
获取输出目录的函数。
默认值：`inputDir => `${path.basename(inputDir)}.cleants``

##### `removeDependencies?: Array<string>`
要移除的依赖。
默认值：`['typescript', 'vue-tsc', '@types/node']`

##### `replaceInternalImports?: boolean`
是否替换内部导入。
默认值：`true`

##### `plugins?: Array<Plugin>`
要使用的插件列表。
默认值：`[basePlugin, vuePlugin]`

#### 注意

- `actualOutputDir` 将设置为 `path.join(outputDir, options.getOutputDir(inputDir))`
- 如果没有提供 `options.plugins`，默认使用 `[basePlugin, vuePlugin]`

## 贡献

欢迎贡献、提出问题和功能请求！请随时查看 [issues 页面](https://github.com/viarotel-org/cleants/issues)。

## 支持

如果这个项目对你的工作或学习有所帮助，请考虑为项目点赞或通过以下链接请我喝杯咖啡：

<div style="display:flex;">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/zh-CN/viarotel-wepay.jpg" alt="viarotel-wepay" width="30%">
  <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/zh-CN/viarotel-alipay.jpg" alt="viarotel-alipay" width="30%">
  <a href="https://www.paypal.com/paypalme/viarotel" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.jsdelivr.net/gh/viarotel-org/escrcpy@main/screenshots/en-US/viarotel-paypal.png" alt="viarotel-paypal" width="30%">
  </a>
</div>

## 贡献者

感谢所有贡献者！

<a href="https://github.com/viarotel-org/cleants/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=viarotel-org/cleants" alt="contributors" />
</a>

## 📚 关键词
`typescript` `javascript` `converter` `vue` `cli`

## 许可证

此项目依据 [MIT](LICENSE) 许可证发布。

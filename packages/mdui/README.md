# mdui

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i mdui-button
```

### 通过 CDN 引入所有组件

```html
<script src="https://example.com/index.js"></script>
```

### 通过 CDN 按需引入所需组件

```html
<script src="https://example.com/button/index.js"></script>
<script src="https://example.com/checkbox/index.js"></script>
```

### ES6 模块中导入所有组件

```js
import 'mdui';
```

### ES6 模块中按需导入所需组件

```js
import 'mdui/button/index.js';
import 'mdui/checkbox/index.js';
```

### ES6 中导入模块

```js
import { MduiButton, MduiCheckbox } from 'mdui';
```

### CDN 使用 jsdelivr

添加 .min 获取压缩后的版本
使用 , 分隔，获取合并后的版本

### 注意

dist 目录中的代码不要压缩，交由 jsdelivr 来处理

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i mdui-t
```

## Usage
```html
<script type="module">
  import 'mdui-t/mdui-t.js';
</script>

<mdui-t></mdui-t>
```

## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well
```bash
npm run lint:eslint
```
```bash
npm run lint:prettier
```

To automatically fix many linting errors, run
```bash
npm run format
```

You can format using ESLint and Prettier individually as well
```bash
npm run format:eslint
```
```bash
npm run format:prettier
```

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
npm run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
npm run test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`
```bash
npm start
```
To run a local development server that serves the basic demo located in `demo/index.html`

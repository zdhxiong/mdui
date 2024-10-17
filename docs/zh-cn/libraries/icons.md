`@mdui/icons` 是一个独立的包，它包含了所有的 Material Icons 图标，每个图标都是一个独立的文件。

你可以按需导入所需的图标，而不必导入整个图标库。因此，使用 `@mdui/icons` 相比于使用 [`<mdui-icon>`](/zh-cn/docs/2/components/icon) 组件，可以显著减少项目打包后的体积。

## 安装 {#installation}

你需要单独安装该包：

```bash
npm install @mdui/icons --save
```

## 使用 {#usage}

安装完成后，导入所需的图标文件：

```js
import '@mdui/icons/search.js';
```

然后，就可以使用对应的图标组件了：

```html
<mdui-icon-search></mdui-icon-search>
```

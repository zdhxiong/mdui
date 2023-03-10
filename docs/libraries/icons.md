`@mdui/icons` 是一个独立的包，包含了 Material Icons 的所有图标，其中每一个图标组件都是一个独立的文件，你可以按需导入需要的图标组件，而无需导入整个图标库。因此，相比使用 [`<mdui-icon>`](/docs/2/components/icon) 组件，使用 `@mdui/icons` 可以大幅缩减项目打包后的体积。

## 安装 {#installation}

要使用该包，你需要单独进行安装：

```bash
npm install @mdui/icons --save
```

## 使用 {#usage}

安装完后，导入需要使用的图标文件：

```js
import '@mdui/icons/search.js';
```

然后就能使用对应的图标组件了：

```html
<mdui-icon-search></mdui-icon-search>
```

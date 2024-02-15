图标用于表示常见的操作。它支持 Material Icons 图标，也支持使用 SVG 图标。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/icon.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Icon } from 'mdui/components/icon.js';
```

使用示例：

```html,example
<mdui-icon name="search"></mdui-icon>
```

### 使用 Material Icons 图标 {#usage-material-icons}

如果需要通过该组件使用 Material Icons 图标，你需要单独导入 Material Icons 的 CSS 文件。Material Icons 共有 5 种变体，分别为：Filled、Outlined、Rounded、Sharp、Two Tone，请根据你要使用的图标变体，导入对应的 CSS 文件：

```html
<!-- Filled -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Outlined -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

<!-- Rounded -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

<!-- Sharp -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet">

<!-- Two Tone -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Two+Tone" rel="stylesheet">
```

使用组件时，在 `name` 属性中传入图标名称，并以图标变体名称为后缀（Filled 变体无需添加后缀），下面是 `delete` 图标的 5 种变体的使用方式：

```html,example
<!-- Filled -->
<mdui-icon name="delete"></mdui-icon>

<!-- Outlined -->
<mdui-icon name="delete--outlined"></mdui-icon>

<!-- Rounded -->
<mdui-icon name="delete--rounded"></mdui-icon>

<!-- Sharp -->
<mdui-icon name="delete--sharp"></mdui-icon>

<!-- Two Tone -->
<mdui-icon name="delete--two-tone"></mdui-icon>
```

你可以直接在页面下方的 [Material Icons 图标搜索](/zh-cn/docs/2/components/icon#search) 工具中搜索图标，然后点击需要使用的图标，就会自动将图标代码复制到剪贴板。

另外，mdui 还提供了一个独立的包 [`@mdui/icons`](/zh-cn/docs/2/libraries/icons)，这个包里每一个图标组件都是一个独立的文件，使你可以按需导入需要的图标组件，而无需导入整个图标库。

### 使用 SVG 图标 {#usage-svg}

该组件也支持使用 SVG 图标作为图标内容。可通过组件的 `src` 属性传入 SVG 图标的链接。例如：

```html,example
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg"></mdui-icon>
```

也可以在组件的 default slot 中传入 SVG 的内容。例如：

```html,example
<mdui-icon>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
</mdui-icon>
```

## 示例 {#examples}

### 设置颜色 {#example-color}

设置 `<mdui-icon>` 元素或父元素的 `color` CSS 样式修改图标颜色。

```html,example,expandable
<mdui-icon name="delete" style="color: red"></mdui-icon>
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg" style="color: red"></mdui-icon>
```

### 设置大小 {#example-size}

设置 `<mdui-icon>` 元素或父元素的 `font-size` CSS 样式修改图标大小。

```html,example,expandable
<mdui-icon name="delete" style="font-size: 32px"></mdui-icon>
<mdui-icon src="https://fonts.gstatic.com/s/i/materialicons/search/v17/24px.svg" style="font-size: 32px"></mdui-icon>
```

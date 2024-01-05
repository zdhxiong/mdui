按钮用于让用户执行某些操作，例如发送邮件、分享文档或点赞评论等。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/button.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Button } from 'mdui/components/button.js';
```

使用示例：

```html,example
<mdui-button>Button</mdui-button>
```

## 示例 {#examples}

### 形状 {#example-variant}

使用 `variant` 属性设置按钮的形状。

```html,example,expandable
<mdui-button variant="elevated">Elevated</mdui-button>
<mdui-button variant="filled">Filled</mdui-button>
<mdui-button variant="tonal">Tonal</mdui-button>
<mdui-button variant="outlined">Outlined</mdui-button>
<mdui-button variant="text">Text</mdui-button>
```

### 全宽 {#example-full-width}

添加 `full-width` 属性可使按钮显示为块状元素，即占据全部宽度。

```html,example,expandable
<mdui-button full-width>Button</mdui-button>
```

### 图标 {#example-icon}

设置 `icon`、`end-icon` 属性，可分别在按钮左侧、右侧添加 Material Icons 图标。也可以通过 `icon`、`end-icon` slot 在按钮左侧、右侧添加元素。

```html,example,expandable
<mdui-button icon="search" end-icon="arrow_forward">Icon</mdui-button>
<mdui-button>
  Slot
  <mdui-icon slot="icon" name="downloading"></mdui-icon>
  <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
</mdui-button>
```

### 链接 {#example-link}

设置 `href` 属性，可使按钮变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-button href="https://www.mdui.org" target="_blank">Link</mdui-button>
```

### 禁用及 loading 状态 {#example-disabled}

添加 `disabled` 属性可禁用按钮；添加 `loading` 属性可为按钮添加加载中状态。

```html,example,expandable
<mdui-button disabled>Disabled</mdui-button>
<mdui-button loading>Loading</mdui-button>
<mdui-button loading disabled>Loading & Disabled</mdui-button>
```

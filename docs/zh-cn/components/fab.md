浮动操作按钮（FAB）用于页面上最重要的操作，你可以用它把关键操作放在触手可及的位置。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/fab.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Fab } from 'mdui/components/fab.js';
```

使用示例：

```html,example
<mdui-fab icon="edit"></mdui-fab>
```

## 示例 {#examples}

### 图标 {#example-icon}

使用 `icon` 属性指定 Material Icons 图标名称。也可以通过 `icon` slot 指定图标元素。

```html,example,expandable
<mdui-fab icon="edit"></mdui-fab>
<mdui-fab>
  <mdui-icon slot="icon" name="edit"></mdui-icon>
</mdui-fab>
```

### 展开状态 {#example-extended}

添加 `extended` 属性可将 Fab 设置为展开状态，此时 default slot 中的文本将显示出来。

```html,example,expandable
<mdui-fab extended icon="edit">Compose</mdui-fab>
```

### 形状 {#example-variant}

使用 `variant` 属性设置 Fab 的形状。

```html,example,expandable
<mdui-fab variant="primary" icon="edit"></mdui-fab>
<mdui-fab variant="surface" icon="edit"></mdui-fab>
<mdui-fab variant="secondary" icon="edit"></mdui-fab>
<mdui-fab variant="tertiary" icon="edit"></mdui-fab>
```

### 大小 {#example-size}

使用 `size` 属性设置 Fab 的大小。

```html,example,expandable
<mdui-fab size="small" icon="edit"></mdui-fab>
<mdui-fab size="normal" icon="edit"></mdui-fab>
<mdui-fab size="large" icon="edit"></mdui-fab>
```

### 链接 {#example-link}

添加 `href` 属性，可使 Fab 变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-fab icon="edit" href="https://www.mdui.org" target="_blank"></mdui-fab>
```

### 禁用及 loading 状态 {#example-disabled}

添加 `disabled` 属性可禁用 Fab；添加 `loading` 属性可为 Fab 添加加载中状态。

```html,example,expandable
<mdui-fab disabled icon="edit"></mdui-fab>
<mdui-fab loading icon="edit"></mdui-fab>
<mdui-fab loading disabled icon="edit"></mdui-fab>
```

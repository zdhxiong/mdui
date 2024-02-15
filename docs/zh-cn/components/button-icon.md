图标按钮主要用于执行一些次要的操作。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/button-icon.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { ButtonIcon } from 'mdui/components/button-icon.js';
```

使用示例：

```html,example
<mdui-button-icon icon="search"></mdui-button-icon>
```

## 示例 {#examples}

### 图标 {#example-icon}

使用 `icon` 属性指定 Material Icons 图标名称。也可以通过 default slot 指定图标元素。

```html,example,expandable
<mdui-button-icon icon="search"></mdui-button-icon>
<mdui-button-icon>
  <mdui-icon name="search"></mdui-icon>
</mdui-button-icon>
```

### 形状 {#example-variant}

使用 `variant` 属性设置图标按钮的形状。

```html,example,expandable
<mdui-button-icon variant="standard" icon="search"></mdui-button-icon>
<mdui-button-icon variant="filled" icon="search"></mdui-button-icon>
<mdui-button-icon variant="tonal" icon="search"></mdui-button-icon>
<mdui-button-icon variant="outlined" icon="search"></mdui-button-icon>
```

### 可选中 {#example-selectable}

添加 `selectable` 属性使图标按钮可被选中。

```html,example,expandable
<mdui-button-icon selectable icon="favorite_border"></mdui-button-icon>
```

使用 `selected-icon` 属性指定选中状态的 Material Icons 图标名称。也可以通过 `selected-icon` slot 指定选中状态的图标元素。

```html,example,expandable
<mdui-button-icon selectable icon="favorite_border" selected-icon="favorite"></mdui-button-icon>
<mdui-button-icon selectable icon="favorite_border">
  <mdui-icon slot="selected-icon" name="favorite"></mdui-icon>
</mdui-button-icon>
```

图标按钮被选中后，`selected` 属性变为 `true`。也可以通过添加 `selected` 属性，使图标按钮默认处于选中状态。

```html,example,expandable
<mdui-button-icon selectable selected icon="favorite_border" selected-icon="favorite"></mdui-button-icon>
```

### 链接 {#example-link}

添加 `href` 属性，可使图标按钮变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-button-icon icon="search" href="https://www.mdui.org" target="_blank"></mdui-button-icon>
```

### 禁用及 loading 状态 {#example-disabled}

添加 `disabled` 属性可禁用图标按钮；添加 `loading` 属性可为图标按钮添加加载中状态。

```html,example,expandable
<mdui-button-icon disabled icon="search" variant="tonal"></mdui-button-icon>
<mdui-button-icon loading icon="search" variant="tonal"></mdui-button-icon>
<mdui-button-icon loading disabled icon="search" variant="tonal"></mdui-button-icon>
```

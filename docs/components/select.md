下拉选择用于在一个下拉菜单中提供一系列选项。

这个页面仅介绍 `<mdui-select>` 组件的用法，下拉菜单项的用法，请参见 [`<mdui-menu-item>`](/docs/2/components/menu#menu-item-api)。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/select.js';
import 'mdui/components/menu-item.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Select } from 'mdui/components/select.js';
import type { MenuItem } from 'mdui/components/menu-item.js';
```

使用示例：

```html,example
<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

## 示例 {#examples}

### 形状 {#example-variant}

使用 `variant` 属性设置下拉选择的形状。

```html,example,expandable
<mdui-select variant="filled" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<mdui-select variant="outlined" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 支持多选 {#example-multiple}

下拉选择默认为单选，`<mdui-select>` 组件的 `value` 值即为当前选中的 [`<mdui-menu-item>`](/docs/2/components/menu#menu-item-api) 的 `value` 值。

添加 `multiple` 属性可使下拉选择变为多选。此时 `<mdui-select>` 的 `value` 值为当前选中的 [`<mdui-menu-item>`](/docs/2/components/menu#menu-item-api) 的 `value` 的值组成的数组。

注意：支持多选时，`<mdui-select>` 的 `value` 值为数组，只能通过 JavaScript 属性来读取和设置该值。

```html,example,expandable
<mdui-select multiple class="example-multiple">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-menu-item value="item-3">Item 3</mdui-menu-item>
</mdui-select>

<script>
  // 设置默认选中 item-1 和 item-2
  const select = document.querySelector(".example-multiple");
  select.value = ["item-1", "item-2"];
</script>
```

### 辅助文本 {#example-helper-text}

使用 `label` 属性设置下拉选择上方的标签文本。

```html,example,expandable
<mdui-select label="Text Field" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

使用 `placeholder` 属性设置没有选中值时的占位文本。

```html,example,expandable
<mdui-select placeholder="Placeholder">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

使用 `helper` 属性设置下拉选择底部的帮助文本。也可以使用 `helper` slot 来设置帮助文本。

```html,example,expandable
<mdui-select helper="Supporting text">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<mdui-select>
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <span slot="helper" style="color: blue">Supporting text</span>
</mdui-select>
```

### 只读状态 {#example-readonly}

添加 `readonly` 属性使下拉选择进入只读状态。

```html,example,expandable
<mdui-select readonly value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可禁用下拉选择。

```html,example,expandable
<mdui-select disabled value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 可清空 {#example-clearable}

添加 `clearable` 属性后，在下拉选择有值时，会在右侧添加清空按钮。

```html,example,expandable
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

可通过 `clear` slot 自定义清空按钮。

```html,example,expandable
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-icon slot="clear" name="delete"></mdui-icon>
</mdui-select>
```

### 下拉菜单位置 {#example-placement}

可通过 `placement` 属性设置下拉菜单的位置。

```html,example,expandable
<mdui-select placement="top" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 文本右对齐 {#example-end-aligned}

添加 `end-aligned` 属性可使文本右对齐。

```html,example,expandable
<mdui-select end-aligned value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 前后文本及图标 {#example-prefix-suffix}

设置 `icon`、`end-icon` 属性，可分别在下拉选择的左侧、右侧添加 Material Icons 图标。也可以通过 `icon`、`end-icon` slot 在下拉选择左侧、右侧添加元素。

```html,example,expandable
<mdui-select value="item-1" icon="search" end-icon="mic">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<br/><br/>

<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-button-icon slot="icon" icon="search"></mdui-button-icon>
  <mdui-button-icon slot="end-icon" icon="mic"></mdui-button-icon>
</mdui-select>
```

设置 `prefix` 和 `suffix` 属性，可分别在下拉选择的左侧、右侧添加文本。也可以通过 `prefix`、`suffix` slot 在下拉选择左侧、右侧添加文本元素。这些文本只有在下拉选择聚焦、或有值时才会显示。

```html,example,expandable
<mdui-select value="item-1" prefix="$" suffix="/100">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<br/><br/>

<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <span slot="prefix" style="color: blue">$</span>
  <span slot="suffix" style="color: blue">/100</span>
</mdui-select>
```

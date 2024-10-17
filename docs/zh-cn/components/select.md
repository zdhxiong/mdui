下拉选择组件在一个下拉菜单中提供多种选项，方便用户快速选择所需内容。

本页面主要介绍 `<mdui-select>` 组件的使用方法，关于下拉菜单项的用法，请参见 [`<mdui-menu-item>`](/zh-cn/docs/2/components/menu#menu-item-api)。

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

通过 `variant` 属性设置下拉选择的形状。

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

### 多选支持 {#example-multiple}

下拉选择默认为单选，`<mdui-select>` 组件的 `value` 值即为当前选中的 [`<mdui-menu-item>`](/zh-cn/docs/2/components/menu#menu-item-api) 的 `value` 值。

添加 `multiple` 属性可以使下拉选择支持多选。此时 `<mdui-select>` 的 `value` 值为当前选中的 [`<mdui-menu-item>`](/zh-cn/docs/2/components/menu#menu-item-api) 的 `value` 的值组成的数组。

注意：在支持多选时，`<mdui-select>` 的 `value` 值为数组，只能通过 JavaScript 属性来读取和设置该值。

```html,example,expandable
<mdui-select multiple class="example-multiple">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-menu-item value="item-3">Item 3</mdui-menu-item>
</mdui-select>

<script>
  // 默认选中 item-1 和 item-2
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

使用 `placeholder` 属性设置未选中值时的占位文本。

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

### 只读模式 {#example-readonly}

通过添加 `readonly` 属性，可以将下拉选择设置为只读模式。

```html,example,expandable
<mdui-select readonly value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 禁用模式 {#example-disabled}

通过添加 `disabled` 属性，可以禁用下拉选择。

```html,example,expandable
<mdui-select disabled value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 可清空 {#example-clearable}

添加 `clearable` 属性后，当下拉选择有值时，右侧会出现一个清空按钮。

```html,example,expandable
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

也可以通过 `clear` slot 自定义清空按钮。

```html,example,expandable
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-icon slot="clear" name="delete"></mdui-icon>
</mdui-select>
```

### 下拉菜单位置 {#example-placement}

通过 `placement` 属性，你可以设置下拉菜单的位置。

```html,example,expandable
<mdui-select placement="top" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 文本右对齐 {#example-end-aligned}

添加 `end-aligned` 属性，可以使文本右对齐。

```html,example,expandable
<mdui-select end-aligned value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### 前后文本及图标 {#example-prefix-suffix}

通过设置 `icon` 和 `end-icon` 属性，可以在下拉选择的左侧和右侧添加 Material Icons 图标。你也可以通过 `icon` 和 `end-icon` slot 在下拉选择的左侧和右侧添加元素。

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

通过设置 `prefix` 和 `suffix` 属性，可以在下拉选择的左侧和右侧添加文本。也可以通过 `prefix` 和 `suffix` slot 在下拉选择的左侧和右侧添加文本元素。这些文本只有在下拉选择聚焦或有值时才会显示。

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

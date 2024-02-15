文本框组件允许用户在页面中输入文本，通常用于表单和对话框。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/text-field.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { TextField } from 'mdui/components/text-field.js';
```

使用示例：

```html,example
<mdui-text-field label="Text Field"></mdui-text-field>
```

## 示例 {#examples}

### 形状 {#example-variant}

通过 `variant` 属性设置文本框的形状。

```html,example,expandable
<mdui-text-field variant="filled" label="Text Field"></mdui-text-field>
<mdui-text-field variant="outlined" label="Text Field"></mdui-text-field>
```

### 辅助文本 {#example-helper-text}

通过 `label` 属性设置文本框上方的标签文本。

```html,example,expandable
<mdui-text-field label="Text Field"></mdui-text-field>
```

通过 `placeholder` 属性设置无值时的占位文本。

```html,example,expandable
<mdui-text-field label="Text Field" placeholder="Placeholder"></mdui-text-field>
```

通过 `helper` 属性设置文本框底部的帮助文本。也可以使用 `helper` slot 来设置帮助文本。添加 `helper-on-focus` 属性则仅在输入框聚焦时显示帮助文本。

```html,example,expandable
<mdui-text-field label="Text Field" helper="Supporting text"></mdui-text-field>

<mdui-text-field label="Text Field">
  <span slot="helper" style="color: blue">Supporting text</span>
</mdui-text-field>

<mdui-text-field label="Text Field" helper="Supporting text" helper-on-focus></mdui-text-field>
```

### 可清空 {#example-clearable}

添加 `clearable` 属性后，当文本框有值时，会在右侧添加清空按钮。

```html,example,expandable
<mdui-text-field clearable label="Text Field" value="Input Text"></mdui-text-field>
```

### 文本右对齐 {#example-end-aligned}

添加 `end-aligned` 属性可以使文本右对齐。

```html,example,expandable
<mdui-text-field end-aligned label="Text Field" value="Input Text"></mdui-text-field>
```

### 前后文本及图标 {#example-prefix-suffix}

通过设置 `icon` 和 `end-icon` 属性，可以在文本框的左侧和右侧添加 Material Icons 图标。也可以通过 `icon` 和 `end-icon` slot 在文本框的左侧和右侧添加元素。

```html,example,expandable
<mdui-text-field icon="search" end-icon="mic" label="Text Field"></mdui-text-field>

<br/><br/>

<mdui-text-field label="Text Field">
  <mdui-button-icon slot="icon" icon="search"></mdui-button-icon>
  <mdui-button-icon slot="end-icon" icon="mic"></mdui-button-icon>
</mdui-text-field>
```

通过设置 `prefix` 和 `suffix` 属性，可以在文本框的左侧和右侧添加文本。也可以通过 `prefix` 和 `suffix` slot 在文本框的左侧和右侧添加文本元素。这些文本只有在文本框聚焦或有值时才会显示。

```html,example,expandable
<mdui-text-field prefix="$" suffix="/100" label="Text Field"></mdui-text-field>

<br/><br/>

<mdui-text-field label="Text Field">
  <span slot="prefix" style="color: blue">$</span>
  <span slot="suffix" style="color: blue">/100</span>
</mdui-text-field>
```

### 只读模式 {#example-readonly}

通过添加 `readonly` 属性，可以将文本框设置为只读模式。

```html,example,expandable
<mdui-text-field readonly label="Text Field" value="Input Text"></mdui-text-field>
```

### 禁用状态 {#example-disabled}

通过添加 `disabled` 属性，可以禁用文本框。

```html,example,expandable
<mdui-text-field disabled label="Text Field" value="Input Text"></mdui-text-field>
```

### 多行文本框 {#example-rows}

通过 `rows` 属性，可以设置多行文本框的行数。

```html,example,expandable
<mdui-text-field rows="3" label="Text Field"></mdui-text-field>
```

也可以添加 `autosize` 属性，使文本框能根据输入内容的长度自动调整高度。通过 `min-rows` 和 `max-rows` 属性，可以指定自动调整高度时的最小行数和最大行数。

```html,example,expandable
<mdui-text-field autosize label="Text Field"></mdui-text-field>

<mdui-text-field autosize min-rows="2" max-rows="5" label="Text Field"></mdui-text-field>
```

### 字数统计 {#example-counter}

当通过 `maxlength` 属性设置了最大字数时，可以添加 `counter` 属性在文本框下方显示字数统计。

```html,example,expandable
<mdui-text-field maxlength="20" counter label="Text Field"></mdui-text-field>
```

### 密码框 {#example-password}

当 `type="password"` 时，添加 `toggle-password` 属性可以在文本框右侧添加切换密码可见性的按钮。

```html,example,expandable
<mdui-text-field type="password" toggle-password label="Text Field"></mdui-text-field>
```

复选框允许用户从一组选项中选择一个或多个选项，或者切换单个选项的开/关状态。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/checkbox.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Checkbox } from 'mdui/components/checkbox.js';
```

使用示例：

```html,example
<mdui-checkbox>Checkbox</mdui-checkbox>
```

## 示例 {#examples}

### 选中状态 {#example-checked}

复选框选中时，`checked` 属性值为 `true`。添加 `checked` 属性可以使复选框默认处于选中状态。

```html,example,expandable
<mdui-checkbox checked>Checkbox</mdui-checkbox>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可以禁用复选框。

```html,example,expandable
<mdui-checkbox disabled>Checkbox</mdui-checkbox>
<mdui-checkbox disabled checked>Checkbox</mdui-checkbox>
```

### 不确定状态 {#example-indeterminate}

添加 `indeterminate` 属性表示复选框处于不确定状态。

```html,example,expandable
<mdui-checkbox indeterminate>Checkbox</mdui-checkbox>
```

### 图标 {#example-icon}

通过设置 `unchecked-icon`、`checked-icon`、`indeterminate-icon` 属性，可以分别设置未选中、选中、不确定状态时的复选框的 Material Icons 图标。也可以通过 `unchecked-icon`、`checked-icon`、`indeterminate-icon` slot 进行设置。

```html,example,expandable
<mdui-checkbox
  unchecked-icon="radio_button_unchecked"
  checked-icon="check_circle"
  indeterminate-icon="playlist_add_check_circle"
>Checkbox</mdui-checkbox>

<mdui-checkbox
  indeterminate
  unchecked-icon="radio_button_unchecked"
  checked-icon="check_circle"
  indeterminate-icon="playlist_add_check_circle"
>Checkbox</mdui-checkbox>

<br/>

<mdui-checkbox>
  <mdui-icon slot="unchecked-icon" name="radio_button_unchecked"></mdui-icon>
  <mdui-icon slot="checked-icon" name="check_circle"></mdui-icon>
  <mdui-icon slot="indeterminate-icon" name="playlist_add_check_circle"></mdui-icon>
  Checkbox
</mdui-checkbox>

<mdui-checkbox indeterminate>
  <mdui-icon slot="unchecked-icon" name="radio_button_unchecked"></mdui-icon>
  <mdui-icon slot="checked-icon" name="check_circle"></mdui-icon>
  <mdui-icon slot="indeterminate-icon" name="playlist_add_check_circle"></mdui-icon>
  Checkbox
</mdui-checkbox>
```

单选框用于让用户从一组选项中选择一个选项。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/radio-group.js';
import 'mdui/components/radio.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { RadioGroup } from 'mdui/components/radio-group.js';
import type { Radio } from 'mdui/components/radio.js';
```

使用示例：

```html,example
<mdui-radio-group value="chinese">
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

## 示例 {#examples}

### 选中状态 {#example-checked}

`<mdui-radio-group>` 组件的 `value` 属性值即当前选中的 `<mdui-radio>` 组件的 `value` 属性值。也可以通过更新 `<mdui-radio-group>` 组件的 `value` 属性值，来切换当前选中的单选框。

```html,example,expandable
<mdui-radio-group value="chinese">
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

可以单独使用 `<mdui-radio>` 组件，此时可以通过 `checked` 属性来读取和修改选中状态。

```html,example,expandable
<mdui-radio checked>Radio</mdui-radio>
```

### 禁用状态 {#example-disabled}

在 `<mdui-radio-group>` 组件上添加 `disabled` 属性可禁用整个单选框组。

```html,example,expandable
<mdui-radio-group disabled>
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

在 `<mdui-radio>` 组件上添加 `disabled` 属性可禁用特定单选框。

```html,example,expandable
<mdui-radio-group>
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english" disabled>English</mdui-radio>
</mdui-radio-group>
```

### 图标 {#example-icon}

可通过设置 `unchecked-icon`、`checked-icon` 属性，分别设置未选中、选中状态的单选框的 Material Icons 图标。也可以通过 `unchecked-icon`、`checked-icon` slot 进行设置。

```html,example,expandable
<mdui-radio-group value="chinese">
  <mdui-radio
    unchecked-icon="check_box_outline_blank"
    checked-icon="lock"
    value="chinese"
  >Chinese</mdui-radio>
  <mdui-radio value="english">
    <mdui-icon slot="unchecked-icon" name="check_box_outline_blank"></mdui-icon>
    <mdui-icon slot="checked-icon" name="lock"></mdui-icon>
    English
  </mdui-radio>
</mdui-radio-group>
```

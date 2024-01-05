开关切换用于切换单个项目的打开或关闭状态。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/switch.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Switch } from 'mdui/components/switch.js';
```

使用示例：

```html,example
<mdui-switch></mdui-switch>
```

## 示例 {#examples}

### 选中状态 {#example-checked}

选中时，`checked` 属性变为 `true`。也可以通过添加 `checked` 属性，使开关切换默认处于打开状态。

```html,example,expandable
<mdui-switch checked></mdui-switch>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可禁用该组件。

```html,example,expandable
<mdui-switch disabled></mdui-switch>
<mdui-switch disabled checked></mdui-switch>
```

### 图标 {#example-icon}

可添加 `unchecked-icon` 属性来设置未选中状态的 Material Icons 图标，添加 `checked-icon` 属性来设置选中状态的 Material Icons 图标。也可以通过 `unchecked-icon` 和 `checked-icon` slot 来设置未选中、及选中状态的图标元素。

```html,example,expandable
<mdui-switch unchecked-icon="remove_moderator" checked-icon="verified_user"></mdui-switch>
<mdui-switch>
  <mdui-icon slot="unchecked-icon" name="remove_moderator"></mdui-icon>
  <mdui-icon slot="checked-icon" name="verified_user"></mdui-icon>
</mdui-switch>
```

纸片组件用于辅助用户输入信息、进行选择、筛选内容或执行相关操作。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/chip.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Chip } from 'mdui/components/chip.js';
```

使用示例：

```html,example
<mdui-chip>Chip</mdui-chip>
```

## 示例 {#examples}

### 形状 {#example-variant}

使用 `variant` 属性设置纸片的形状。纸片有 4 种形状，可以根据用途选择：

* `assist`：用于显示与当前上下文相关的辅助操作。例如，在点餐页面，提供分享，收藏等功能。
* `filter`：用于对内容进行筛选。例如，在搜索结果页，对搜索结果进行过滤。
* `input`：用于表示用户输入的信息片段。例如，在 Gmail 中的“收件人”字段中的联系人。
* `suggestion`：用于提供动态生成的推荐信息，以简化用户操作。例如，在聊天应用中猜测用户可能想发送的信息，供用户选择。

```html,example,expandable
<mdui-chip variant="assist">Assist</mdui-chip>
<mdui-chip variant="filter">Filter</mdui-chip>
<mdui-chip variant="input">Input</mdui-chip>
<mdui-chip variant="suggestion">Suggestion</mdui-chip>
```

### 阴影 {#example-elevated}

添加 `elevated` 属性可以使纸片拥有阴影。

```html,example,expandable
<mdui-chip elevated>Chip</mdui-chip>
```

### 图标 {#example-icon}

添加 `icon`、`end-icon` 属性，可以分别在纸片左侧、右侧添加 Material Icons 图标。也可以通过 `icon`、`end-icon` slot 在纸片左侧、右侧添加元素。

```html,example,expandable
<mdui-chip icon="search">Icon</mdui-chip>
<mdui-chip end-icon="arrow_forward">End Icon</mdui-chip>
<mdui-chip>
  Slot
  <mdui-icon slot="icon" name="downloading"></mdui-icon>
  <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
</mdui-chip>
```

### 链接 {#example-link}

添加 `href` 属性，可以使纸片变为链接，此时还可以使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-chip href="https://www.mdui.org" target="_blank">Link</mdui-chip>
```

### 禁用及加载中状态 {#example-disabled}

添加 `disabled` 属性可以禁用纸片；添加 `loading` 属性可以为纸片添加加载中状态。

```html,example,expandable
<mdui-chip disabled>Disabled</mdui-chip>
<mdui-chip loading>Loading</mdui-chip>
<mdui-chip loading disabled>Loading & Disabled</mdui-chip>
```

### 可选中 {#example-selectable}

添加 `selectable` 属性可以使纸片可被选中。

```html,example,expandable
<mdui-chip selectable>Chip</mdui-chip>
```

使用 `selected-icon` 属性可以指定选中状态的 Material Icons 图标名称。也可以通过 `selected-icon` slot 指定选中状态的图标元素。

```html,example,expandable
<mdui-chip selectable selected-icon="favorite">Chip</mdui-chip>
<mdui-chip selectable>
  Chip
  <mdui-icon slot="selected-icon" name="favorite"></mdui-icon>
</mdui-chip>
```

纸片被选中后，`selected` 属性变为 `true`。也可以通过添加 `selected` 属性，使纸片默认处于选中状态。

```html,example,expandable
<mdui-chip selectable selected>Chip</mdui-chip>
```

### 可删除 {#example-deletable}

添加 `deletable` 属性后，纸片右侧会出现一个删除图标。点击该图标会触发 `delete` 事件。您可以通过 `delete-icon` 属性指定删除图标的 Material Icons 图标名，或者通过 `delete-icon` slot 指定删除图标的元素。

```html,example,expandable
<mdui-chip deletable>Chip</mdui-chip>
<mdui-chip deletable delete-icon="backspace">Chip</mdui-chip>
<mdui-chip deletable>
  Chip
  <mdui-icon slot="delete-icon" name="backspace"></mdui-icon>
</mdui-chip>
```

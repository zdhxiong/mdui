下拉组件用于在一个弹出的控件中展示特定内容，它通常和菜单组件配合使用。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/dropdown.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Dropdown } from 'mdui/components/dropdown.js';
```

使用示例：

```html,example
<mdui-dropdown>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

## 示例 {#examples}

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可禁用下拉组件。

```html,example,expandable
<mdui-dropdown disabled>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 打开位置 {#example-placement}

使用 `placement` 属性可设置下拉组件的打开位置。

```html,example,expandable
<mdui-dropdown placement="right-start">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 触发方式 {#example-trigger}

使用 `trigger` 属性可设置下拉组件的打开方式。

```html,example,expandable
<mdui-dropdown trigger="hover">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 在光标处打开 {#example-open-on-pointer}

添加 `open-on-pointer` 属性可在光标处打开下拉组件。通常可配合 `trigger="contextmenu"` 来实现用鼠标右键打开菜单。

```html,example,expandable
<mdui-dropdown trigger="contextmenu" open-on-pointer>
  <mdui-card slot="trigger" style="width:100%;height: 80px">在此区域使用鼠标右键打开菜单</mdui-card>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 保持菜单打开状态 {#example-stay-open-on-click}

在下拉组件中使用菜单时，默认点击菜单项时，会自动关闭下拉组件。可通过添加 `stay-open-on-click` 属性，使得在点击菜单项时，保持下拉组件的打开状态。

```html,example,expandable
<mdui-dropdown trigger="click" stay-open-on-click>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 打开/关闭的延时 {#example-delay}

在设置了 `trigger="hover"` 时，可通过 `open-delay`、`close-delay` 属性设置打开延时和关闭延时。

```html,example,expandable
<mdui-dropdown trigger="hover" open-delay="1000" close-delay="1000">
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

菜单组件提供了一系列垂直排列的选项。当用户与按钮、或其他控件交互时，将显示菜单。

如果你需要实现下拉菜单，可以配合 [`<mdui-dropdown>`](/zh-cn/docs/2/components/dropdown) 组件。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/menu.js';
import 'mdui/components/menu-item.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Menu } from 'mdui/components/menu.js';
import type { MenuItem } from 'mdui/components/menu-item.js';
```

使用示例：

```html,example
<mdui-menu>
  <mdui-menu-item>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
</mdui-menu>
```

## 示例 {#examples}

### 下拉菜单 {#example-dropdown}

配合 [`<mdui-dropdown>`](/zh-cn/docs/2/components/dropdown) 组件实现下拉菜单。

```html,example,expandable
<mdui-dropdown>
  <mdui-button slot="trigger">open dropdown</mdui-button>
  <mdui-menu>
    <mdui-menu-item>Item 1</mdui-menu-item>
    <mdui-menu-item>Item 2</mdui-menu-item>
  </mdui-menu>
</mdui-dropdown>
```

### 紧凑布局 {#example-dense}

在 `<mdui-menu>` 组件上添加 `dense` 属性，可以实现紧凑布局。

```html,example,expandable
<mdui-menu dense>
  <mdui-menu-item>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### 禁用菜单项 {#example-disabled}

在 `<mdui-menu-item>` 组件上添加 `disabled` 属性，可以禁用菜单项。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item disabled>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### 支持单选 {#example-selects-single}

在 `<mdui-menu>` 组件上指定 `selects` 属性为 `single`，可以实现单选功能。此时 `<mdui-menu>` 的 `value` 值即为当前选中的 `<mdui-menu-item>` 的 `value` 值。

```html,example,expandable
<mdui-menu selects="single" value="item-2">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-menu>
```

### 支持多选 {#example-selects-multiple}

在 `<mdui-menu>` 组件上指定 `selects` 属性为 `multiple`，可以实现多选功能。此时 `<mdui-menu>` 的 `value` 值即为当前选中的 `<mdui-menu-item>` 的 `value` 值组成的数组。

注意：在多选模式下，`<mdui-menu>` 的 `value` 值为数组，只能通过 JavaScript 属性来读取和设置该值。

```html,example,expandable
<mdui-menu selects="multiple" class="example-multiple">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-menu-item value="item-3">Item 3</mdui-menu-item>
</mdui-menu>

<script>
  // 设置默认选中 item-1 和 item-2
  const menu = document.querySelector(".example-multiple");
  menu.value = ["item-1", "item-2"];
</script>
```

### 图标 {#example-icon}

在 `<mdui-menu-item>` 组件上，通过设置 `icon` 和 `end-icon` 属性，可以分别在菜单项的左侧和右侧添加 Material Icons 图标。通过设置 `end-text` 属性，可以在右侧添加文本。此外，也可以通过 `icon`、`end-icon` 和 `end-text` slot 在菜单项的左侧和右侧添加图标和文本。

如果需要在菜单项左侧空出一个图标的位置以保持与其他菜单项的对齐，可以将 `icon` 属性设置为空字符串。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item icon="visibility" end-icon="add_circle" end-text="Ctrl+X">Item 1</mdui-menu-item>
  <mdui-menu-item>
    Item 2
    <mdui-icon slot="icon" name="visibility"></mdui-icon>
    <mdui-icon slot="end-icon" name="add_circle"></mdui-icon>
    <span slot="end-text">Ctrl+X</span>
  </mdui-menu-item>
  <mdui-menu-item icon="">Item 3</mdui-menu-item>
</mdui-menu>
```

在单选或多选模式下，可以通过 `selected-icon` 属性或 `selected-icon` slot 设置选中状态的图标。

```html,example,expandable
<mdui-menu selects="multiple">
  <mdui-menu-item value="item-1" selected-icon="cloud_done">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">
    <mdui-icon slot="selected-icon" name="done_outline"></mdui-icon>
    Item 2
  </mdui-menu-item>
</mdui-menu>
```

### 链接 {#example-link}

在 `<mdui-menu-item>` 组件上设置 `href` 属性，可以将菜单项转换为链接。此时，还可以使用与链接相关的属性，如：`download`、`target` 和 `rel`。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item href="https://www.mdui.org" target="_blank">Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
</mdui-menu>
```

### 子菜单 {#example-submenu}

在 `<mdui-menu-item>` 组件中，可以使用 `submenu` slot 来指定子菜单项的元素。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

在 `<mdui-menu>` 组件上，可以通过 `submenu-trigger` 属性设置子菜单的触发方式。

```html,example,expandable
<mdui-menu submenu-trigger="click">
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

当 `submenu-trigger` 属性设置为 `hover` 时，可以在 `<mdui-menu>` 组件上通过 `submenu-open-delay` 和 `submenu-close-delay` 属性设置子菜单的打开延时和关闭延时。

```html,example,expandable
<mdui-menu submenu-trigger="hover" submenu-open-delay="1000" submenu-close-delay="1000">
  <mdui-menu-item>
    Line spacing
    <mdui-menu-item slot="submenu">Single</mdui-menu-item>
    <mdui-menu-item slot="submenu">1.5</mdui-menu-item>
    <mdui-menu-item slot="submenu">Double</mdui-menu-item>
    <mdui-menu-item slot="submenu">Custom: 1.2</mdui-menu-item>
  </mdui-menu-item>
  <mdui-menu-item>Paragraph style</mdui-menu-item>
</mdui-menu>
```

### 自定义内容 {#example-custom}

在 `<mdui-menu-item>` 组件中，你可以使用 `custom` slot 来完全自定义菜单项的内容。

```html,example,expandable
<style>
  .custom-item {
    padding: 4px 12px;
  }

  .custom-item .secondary {
    display: none;
    color: #888;
    font-size: 13px;
  }

  .custom-item:hover .secondary {
    display: block
  }
</style>

<mdui-menu>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ABS</div>
      <div class="secondary">取数值的绝对值</div>
    </div>
  </mdui-menu-item>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ACOS</div>
      <div class="secondary">数值的反余弦值，以弧度表示</div>
    </div>
  </mdui-menu-item>
  <mdui-menu-item>
    <div slot="custom" class="custom-item">
      <div>ACOSH</div>
      <div class="secondary">数值的反双曲余弦值</div>
    </div>
  </mdui-menu-item>
</mdui-menu>
```

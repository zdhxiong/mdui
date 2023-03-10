菜单用于提供一个垂直排列的一系列选项。

如果你需要下拉打开菜单，可配合 [`<mdui-dropdown>`](/docs/2/components/dropdown) 组件来实现。

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

可配合 [`<mdui-dropdown>`](/docs/2/components/dropdown) 组件实现下拉菜单。

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

在 `<mdui-menu>` 组件上添加 `dense` 属性，可使菜单使用紧凑布局。

```html,example,expandable
<mdui-menu dense>
  <mdui-menu-item>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### 禁用菜单项 {#example-disabled}

在 `<mdui-menu-item>` 组件上添加 `disabled` 属性，可禁用菜单项。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item disabled>Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
  <mdui-menu-item>Item 3</mdui-menu-item>
</mdui-menu>
```

### 支持单选 {#example-selects-single}

在 `<mdui-menu>` 组件上指定 `selects` 属性为 `single` 使菜单支持单选。此时 `<mdui-menu>` 的 `value` 值即为当前选中的 `<mdui-menu-item>` 的 `value` 值。

```html,example,expandable
<mdui-menu selects="single" value="item-2">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-menu>
```

### 支持多选 {#example-selects-multiple}

在 `<mdui-menu>` 组件上指定 `selects` 属性为 `multiple` 使菜单支持多选。此时 `<mdui-menu>` 的 `value` 值即为当前选中的 `<mdui-menu-item>` 的 `value` 的值组成的数组。

注意：支持多选时，`<mdui-menu>` 的 `value` 值为数组，只能通过 JavaScript 属性来读取和设置该值。

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

在 `<mdui-menu-item>` 组件上设置 `icon`、`end-icon` 属性，可分别在菜单项左侧、右侧添加 Material Icons 图标，设置 `end-text` 属性则可以在右侧设置文本。也可以通过 `icon`、`end-icon`、`end-text` slot 在按钮左侧、右侧添加图标及文本。

支持把 `icon` 属性设置为空字符串，以在菜单项左侧空出一个图标的位置，以便和其他菜单项保持对齐。

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

在支持单选或多选时，可以通过 `selected-icon` 属性设置选中状态的图标。也可以通过 `selected-icon` slot 设置。

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

在 `<mdui-menu-item>` 组件上设置 `href` 属性，可使菜单项变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-menu>
  <mdui-menu-item href="https://www.mdui.org" target="_blank">Item 1</mdui-menu-item>
  <mdui-menu-item>Item 2</mdui-menu-item>
</mdui-menu>
```

### 子菜单 {#example-submenu}

在 `<mdui-menu-item>` 组件中使用 `submenu` slot 可指定子菜单项的元素。

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

在 `<mdui-menu>` 组件上使用 `submenu-trigger` 属性，可设置子菜单的触发方式。

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

在设置了 `submenu-trigger="hover"` 时，可在 `<mdui-menu>` 组件上通过 `submenu-open-delay`、`submenu-close-delay` 属性设置子菜单打开延时和关闭延时。

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

在 `<mdui-menu-item>` 组件中使用 `custom` slot，可完全自定义菜单项的内容。

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

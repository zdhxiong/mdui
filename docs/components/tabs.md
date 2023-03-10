选项卡用于将不同内容、数据集等进行分组。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/tabs.js';
import 'mdui/components/tab.js';
import 'mdui/components/tab-panel.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Tabs } from 'mdui/components/tabs.js';
import type { Tab } from 'mdui/components/tab.js';
import type { TabPanel } from 'mdui/components/tab-panel.js';
```

使用示例：

```html,example
<mdui-tabs value="tab-1">
  <mdui-tab value="tab-1">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

## 示例 {#examples}

### 形状 {#example-variant}

在 `<mdui-tabs>` 组件上使用 `variant` 属性设置选项卡的形状。

```html,example,expandable
<mdui-tabs value="tab-1" variant="primary">
  <mdui-tab value="tab-1">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>

<mdui-tabs value="tab-1" variant="secondary">
  <mdui-tab value="tab-1">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

### 选项卡位置 {#example-placement}

在 `<mdui-tabs>` 组件上使用 `placement` 属性设置选项卡的位置。

```html,example,expandable
<mdui-select class="example-change-placement" placeholder="选择 placement 值" style="width: 180px">
  <mdui-menu-item value="top-start">top-start</mdui-menu-item>
  <mdui-menu-item value="top">top</mdui-menu-item>
  <mdui-menu-item value="top-end">top-end</mdui-menu-item>
  <mdui-menu-item value="bottom-start">bottom-start</mdui-menu-item>
  <mdui-menu-item value="bottom">bottom</mdui-menu-item>
  <mdui-menu-item value="bottom-end">bottom-end</mdui-menu-item>
  <mdui-menu-item value="left-start">left-start</mdui-menu-item>
  <mdui-menu-item value="left">left</mdui-menu-item>
  <mdui-menu-item value="left-end">left-end</mdui-menu-item>
  <mdui-menu-item value="right-start">right-start</mdui-menu-item>
  <mdui-menu-item value="right">right</mdui-menu-item>
  <mdui-menu-item value="right-end">right-end</mdui-menu-item>
</mdui-select>

<mdui-tabs value="tab-1" placement="top-start" class="example-placement">
  <mdui-tab value="tab-1">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1" style="height: 260px">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2" style="height: 260px">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3" style="height: 260px">Panel 3</mdui-tab-panel>
</mdui-tabs>

<script>
  const select = document.querySelector(".example-change-placement");
  const tabs = document.querySelector(".example-placement");

  select.addEventListener("change", (event) => {
    tabs.placement = event.target.value;
  });
</script>
```

### 全宽 {#example-full-width}

在 `<mdui-tabs>` 组件上添加 `full-width` 属性使选项卡占据全部宽度，并由各个选项卡平分。

```html,example,expandable
<mdui-tabs value="tab-1" full-width>
  <mdui-tab value="tab-1">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

### 图标 {#example-icon}

在 `<mdui-tab>` 组件上设置 `icon` 属性，可在选项卡上添加 Material Icons 图标。也可以通过 `icon` slot 添加图标元素。

添加 `inline` 属性可将图标和文本水平排列。

```html,example,expandable
<mdui-tabs value="tab-1">
  <mdui-tab value="tab-1" icon="library_music">Tab 1</mdui-tab>
  <mdui-tab value="tab-2">
    Tab 2
    <mdui-icon slot="icon" name="movie"></mdui-icon>
  </mdui-tab>
  <mdui-tab value="tab-3" icon="menu_book" inline>Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

### 徽标 {#example-badge}

在 `<mdui-tab>` 组件中，可通过 `badge` slot 添加徽标。

```html,example,expandable
<mdui-tabs value="tab-1">
  <mdui-tab value="tab-1">
    Tab 1
    <mdui-badge slot="badge">99+</mdui-badge>
  </mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

### 自定义内容 {#example-custom}

在 `<mdui-tab>` 组件中使用 `custom` slot，可完全自定义选项卡的内容。

```html,example,expandable
<mdui-tabs value="tab-1">
  <mdui-tab value="tab-1">
    Tab 1
    <mdui-chip slot="custom" icon="search">Icon</mdui-chip>
  </mdui-tab>
  <mdui-tab value="tab-2">Tab 2</mdui-tab>
  <mdui-tab value="tab-3">Tab 3</mdui-tab>

  <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
  <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
</mdui-tabs>
```

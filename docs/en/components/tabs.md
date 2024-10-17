Tabs organize content across different screens and views.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/tabs.js';
import 'mdui/components/tab.js';
import 'mdui/components/tab-panel.js';
```

Import the TypeScript type:

```ts
import type { Tabs } from 'mdui/components/tabs.js';
import type { Tab } from 'mdui/components/tab.js';
import type { TabPanel } from 'mdui/components/tab-panel.js';
```

Example:

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

## Examples {#examples}

### Variant {#example-variant}

The `variant` attribute on the `<mdui-tabs>` component allows you to set the style of the tabs.

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

### Tab Placement {#example-placement}

The `placement` attribute on the `<mdui-tabs>` component allows you to set the position of the tabs.

```html,example,expandable
<mdui-select class="example-change-placement" placeholder="Select placement value" style="width: 180px">
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

### Full Width {#example-full-width}

To make the tabs occupy the entire width and be evenly distributed, add the `full-width` attribute to the `<mdui-tabs>` component.

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

### Icons {#example-icon}

Add Material Icons to the tabs by setting the `icon` attribute on the `<mdui-tab>` component. Alternatively, use the `icon` slot to add icon elements.

Arrange the icon and text horizontally by adding the `inline` attribute.

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

### Badge {#example-badge}

Add a badge to the `<mdui-tab>` component using the `badge` slot.

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

### Custom Content {#example-custom}

Use the `custom` slot in the `<mdui-tab>` component to fully customize the content of the tabs.

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

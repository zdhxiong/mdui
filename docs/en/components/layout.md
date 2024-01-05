Layout components provide a flexible system for page-level layout.

<style>
.example-top-app-bar {
  background-color: rgb(var(--mdui-color-surface-container));
}

.example-navigation-drawer::part(panel) {
  background-color: rgb(var(--mdui-color-surface-container-low));
}

.example-layout-item {
  background-color: rgb(var(--mdui-color-surface-container-low));
}

.example-layout-main {
  background-color: rgb(var(--mdui-color-surface-container-lowest));
}

@media (min-width: 840px) {
  .example-md-visible {
    display: none;
  }
}
</style>

## Usage {#usage}

Import the component:

```js
import 'mdui/components/layout.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
```

Import the TypeScript type:

```ts
import type { Layout } from 'mdui/components/layout.js';
import type { LayoutItem } from 'mdui/components/layout-item.js';
import type { LayoutMain } from 'mdui/components/layout-main.js';
```

**Introduction:**

The layout system is built from the outside in. Each layout component (`<mdui-layout-item>`) occupies space in one of the four directions (top, bottom, left, right). Subsequent layout components continue to occupy the remaining space.

The following components inherit from `<mdui-layout-item>` and can also be used as layout components:

* [`<mdui-navigation-bar>`](/en/docs/2/components/navigation-bar)
* [`<mdui-navigation-drawer>`](/en/docs/2/components/navigation-drawer)
* [`<mdui-navigation-rail>`](/en/docs/2/components/navigation-rail)
* [`<mdui-bottom-app-bar>`](/en/docs/2/components/bottom-app-bar)
* [`<mdui-top-app-bar>`](/en/docs/2/components/top-app-bar)

The `<mdui-layout-main>` component occupies the remaining space, where you can place page content.

## Examples {#examples}

### Layout Component Order {#layout-default-order}

By default, layout components occupy space in the order they appear in the code. The following examples illustrate this concept, showing different orders for [`<mdui-top-app-bar>`](/en/docs/2/components/top-app-bar) and [`<mdui-navigation-drawer>`](/en/docs/2/components/navigation-drawer).

<p class="example-md-visible">View this example on a large screen.</p>

```html,example,expandable
<mdui-layout>
  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-navigation-drawer open class="example-navigation-drawer">
    <mdui-list>
      <mdui-list-item>Navigation drawer</mdui-list-item>
    </mdui-list>
  </mdui-navigation-drawer>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

```html,example,expandable
<mdui-layout>
  <mdui-navigation-drawer open class="example-navigation-drawer">
    <mdui-list>
      <mdui-list-item>Navigation drawer</mdui-list-item>
    </mdui-list>
  </mdui-navigation-drawer>

  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

When [`<mdui-top-app-bar>`](/en/docs/2/components/top-app-bar) is placed before [`<mdui-navigation-drawer>`](/en/docs/2/components/navigation-drawer), it occupies the full screen width first, leaving only the remaining height for `<mdui-navigation-drawer>`. If their positions are swapped, [`<mdui-navigation-drawer>`](/en/docs/2/components/navigation-drawer) occupies the full screen height first, leaving only the remaining width for [`<mdui-top-app-bar>`](/en/docs/2/components/top-app-bar).

### Layout Component Placement {#example-placement}

Use the `placement` attribute to specify the position (top, bottom, left, or right) of the `<mdui-layout-item>` component in the layout. For [`<mdui-navigation-drawer>`](/en/docs/2/components/navigation-drawer) and [`<mdui-navigation-rail>`](/en/docs/2/components/navigation-rail), the `placement` attribute specifies their left or right position.

In the following example, two `<mdui-layout-item>` components are placed on both sides of the application.

```html,example,expandable
<mdui-layout>
  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-layout-item
    placement="left"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-layout-item
    placement="right"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

### Custom Layout Component Order {#example-order}

In most cases, the order of layout components in the code will achieve the desired layout.

However, you can use the `order` attribute to specify the layout order. The system arranges the components in ascending order of `order` value. When `order` values are the same, it arranges them in the order they appear in the code. The default `order` for all layout components is `0`.

```html,example,expandable
<mdui-layout class="example-order">
  <mdui-layout-item
    placement="left"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-checkbox>order="-1"</mdui-checkbox>
  </mdui-top-app-bar>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>

<script>
  const topAppBar = document.querySelector(".example-order mdui-top-app-bar");
  const checkbox = document.querySelector(".example-order mdui-checkbox");

  checkbox.addEventListener("change", (event) => {
    topAppBar.order = event.target.checked ? -1 : 0;
  });
</script>
```

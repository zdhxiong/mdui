The navigation drawer provides a side-access method to different pages on a webpage.

Typically, the [`<mdui-list>`](/en/docs/2/components/list) component is used within the navigation drawer to add navigation items.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/navigation-drawer.js';
```

Import the TypeScript type:

```ts
import type { NavigationDrawer } from 'mdui/components/navigation-drawer.js';
```

Example:

```html,example
<mdui-navigation-drawer close-on-overlay-click class="example-drawer">
  <mdui-button>Close Navigation Drawer</mdui-button>
</mdui-navigation-drawer>

<mdui-button>Open Navigation Drawer</mdui-button>

<script>
  const navigationDrawer = document.querySelector(".example-drawer");
  const openButton = navigationDrawer.nextElementSibling;
  const closeButton = navigationDrawer.querySelector("mdui-button");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

**Notes:**

This component defaults to a `position: fixed` style.

When the `modal` attribute is set to `false` and the breakpoint is equal to or greater than [`--mdui-breakpoint-md`](/en/docs/2/styles/design-tokens#breakpoint), it automatically adds `padding-left` or `padding-right` to the body to prevent content from being obscured.

However, it uses a `position: absolute` style in the following cases:

1. When the `contained` property is `true`.
2. When it's within the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, it doesn't add `padding-left` or `padding-right`.

## Examples {#examples}

### In Container {#example-contained}

By default, the navigation drawer displays on the left or right side of the current window. To place it inside a container, add the `contained` attribute. This positions the navigation drawer relative to the parent element (you need to manually add `position: relative; overflow: hidden;` styles to the parent element).

```html,example,expandable
<div class="example-contained" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer contained>
    <mdui-button class="close">Close Navigation Drawer</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">Open Navigation Drawer</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-contained");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

### Modal {#example-modal}

The `modal` attribute displays a modal overlay when the navigation drawer is open. Note that if the window or parent element width is less than [`--mdui-breakpoint-md`](/en/docs/2/styles/design-tokens#breakpoint), this attribute is ignored and the modal overlay is always displayed.

The `close-on-esc` attribute allows the navigation drawer to close when the ESC key is pressed.

The `close-on-overlay-click` attribute allows the navigation drawer to close when the modal overlay is clicked.

```html,example,expandable
<div class="example-modal" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer modal close-on-esc close-on-overlay-click contained>
    <mdui-button class="close">Close Navigation Drawer</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">Open Navigation Drawer</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-modal");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

### Right Placement {#example-placement}

Set the `placement` attribute to `right` to display the navigation drawer on the right side.

```html,example,expandable
<div class="example-placement" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer placement="right" modal close-on-esc close-on-overlay-click contained>
    <mdui-button class="close">Close Navigation Drawer</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">Open Navigation Drawer</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-placement");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

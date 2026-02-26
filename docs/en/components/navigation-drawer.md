# Navigation Drawer Component

The navigation drawer provides side navigation between pages on a website.

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

```html,example,playgroundId=316
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

By default, this component uses `position: fixed`.

When `modal` is `false` and the breakpoint is at least [`--mdui-breakpoint-md`](/en/docs/2/styles/design-tokens#breakpoint), it automatically adds `padding-left` or `padding-right` to the body to prevent content from being obscured.

However, it uses a `position: absolute` style in the following cases:

1. When the `contained` property is `true`.
2. When the component is used inside the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, `padding-left` or `padding-right` is not added.

## Examples {#examples}

### In Container {#example-contained}

By default, the navigation drawer appears on the left or right side of the viewport. To place it inside a container, add the `contained` attribute. This makes the navigation drawer position itself relative to the parent element (you need to add `position: relative; overflow: hidden;` styles to the parent element).

```html,example,expandable,playgroundId=317
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

The `close-on-esc` attribute lets the navigation drawer close when the ESC key is pressed.

The `close-on-overlay-click` attribute lets the navigation drawer close when the modal overlay is clicked.

```html,example,expandable,playgroundId=318
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

Use the `placement` attribute to place the navigation drawer on the right side.

```html,example,expandable,playgroundId=319
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

# Bottom App Bar Component

The Bottom App Bar provides navigation and key actions at the bottom of a mobile screen.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/bottom-app-bar.js';
```

Import the TypeScript type:

```ts
import type { BottomAppBar } from 'mdui/components/bottom-app-bar.js';
```

Example: (Note: The `style="position: relative"` in the example is for demonstration purposes only. Remove it in production.)

```html,example,playgroundId=193
<mdui-bottom-app-bar style="position: relative;">
  <mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
  <mdui-button-icon icon="edit--outlined"></mdui-button-icon>
  <mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
  <mdui-button-icon icon="image--outlined"></mdui-button-icon>
  <div style="flex-grow: 1"></div>
  <mdui-fab icon="add"></mdui-fab>
</mdui-bottom-app-bar>
```

**Notes:**

The `<mdui-bottom-app-bar>` component uses `position: fixed` by default. It automatically adds `padding-bottom` to the `body` to prevent the page content from being obscured.

However, it falls back to `position: absolute` in the following cases:

1. When the `scroll-target` attribute is specified. In this case, `padding-bottom` is added to the element specified by `scroll-target`.
2. When the component is used inside the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In that case, `padding-bottom` is not added.

## Examples {#examples}

### In Container {#example-scroll-target}

By default, the Bottom App Bar is fixed to the bottom of the page.

To place it inside a specific container, specify the `scroll-target` attribute with the CSS selector or DOM element of the container. The parent element must have `position: relative; overflow: hidden` styles.

```html,example,expandable,playgroundId=194
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar scroll-target=".example-scroll-target">Content</mdui-bottom-app-bar>

  <div class="example-scroll-target" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### Hide on Scroll {#example-scroll-behavior}

To hide the Bottom App Bar when scrolling down and display it when scrolling up, set the `scroll-behavior` attribute to `hide`.

Use the `scroll-threshold` attribute to set how many pixels must be scrolled before the Bottom App Bar starts hiding.

```html,example,expandable,playgroundId=195
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior"
  >Content</mdui-bottom-app-bar>

  <div class="example-scroll-behavior" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### Fixed Floating Action Button {#example-fab-detach}

If the Bottom App Bar includes a [Floating Action Button (FAB)](/en/docs/2/components/fab), add the `fab-detach` attribute to pin the FAB to the page's bottom-right corner when the Bottom App Bar hides on scroll.

```html,example,expandable,playgroundId=196
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar
    fab-detach
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-fab-detach"
  >
    <mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
    <mdui-button-icon icon="edit--outlined"></mdui-button-icon>
    <mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
    <mdui-button-icon icon="image--outlined"></mdui-button-icon>
    <div style="flex-grow: 1"></div>
    <mdui-fab icon="add"></mdui-fab>
  </mdui-bottom-app-bar>

  <div class="example-fab-detach" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

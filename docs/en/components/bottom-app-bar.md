The Bottom App Bar provides navigation and key actions at the bottom of a mobile page.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/bottom-app-bar.js';
```

Import the TypeScript type:

```ts
import type { BottomAppBar } from 'mdui/components/bottom-app-bar.js';
```

Example: (Note: The `style="position: relative"` in the example is for demonstration purposes only. Remove it in actual use.)

```html,example
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

The BottomAppBar component uses `position: fixed` by default. It automatically adds `padding-bottom` to the `body` to prevent the page content from being obscured.

However, it uses `position: absolute` in the following two cases:

1. When the `scroll-target` attribute is specified. In this case, `padding-bottom` will be added to the element specified by `scroll-target`.
2. When it's within the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, `padding-bottom` won't be added.

## Examples {#examples}

### In Container {#example-scroll-target}

By default, the Bottom App Bar displays at the bottom of the page, relative to the current window.

To place it inside a specific container, specify the `scroll-target` attribute with the CSS selector or DOM element of the container. Ensure the parent element has `position: relative; overflow: hidden` styles.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar scroll-target=".example-scroll-target">Content</mdui-bottom-app-bar>

  <div class="example-scroll-target" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### Hide on Scroll {#example-scroll-behavior}

To hide the Bottom App Bar when scrolling down and display it when scrolling up, set the `scroll-behavior` attribute to `hide`.

The `scroll-threshold` attribute can be used to set the number of pixels to start hiding the Bottom App Bar.

```html,example,expandable
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

If the Bottom App Bar includes a [Floating Action Button (FAB)](/en/docs/2/components/fab), add the `fab-detach` attribute to anchor the FAB at the page's bottom right when the Bottom App Bar hides on scroll.

```html,example,expandable
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

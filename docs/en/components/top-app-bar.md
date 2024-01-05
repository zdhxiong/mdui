The Top App Bar provides information and actions related to the current screen, serving as a tool for branding, navigation, search, and actions.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
```

Import the TypeScript type:

```ts
import type { TopAppBar } from 'mdui/components/top-app-bar.js';
import type { TopAppBarTitle } from 'mdui/components/top-app-bar-title.js';
```

Example: (Note: The `style="position: relative"` in the example is for demonstration purposes. Remove it in actual use.)

```html,example
<mdui-top-app-bar style="position: relative;">
  <mdui-button-icon icon="menu"></mdui-button-icon>
  <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
  <div style="flex-grow: 1"></div>
  <mdui-button-icon icon="more_vert"></mdui-button-icon>
</mdui-top-app-bar>
```

**Notes:**

By default, the top app bar uses `position: fixed` and automatically adds `padding-top` to the `body` to prevent the page content from being obscured.

However, it uses `position: absolute` in the following cases:

1. When the `scroll-target` attribute is specified. In this case, `padding-top` is added to the element specified by `scroll-target`.
2. When it is within the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, `padding-top` is not added.

## Examples {#examples}

### In Container {#example-scroll-target}

By default, the top app bar is positioned relative to the current window and appears at the top of the page.

To place the top app bar inside a container, specify the `scroll-target` attribute on the `<mdui-top-app-bar>` component. Set its value to the CSS selector or DOM element of the container with scrollable content. In this case, the top app bar will be positioned relative to the parent element. Ensure to add the styles `position: relative; overflow: hidden` to the parent element.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar scroll-target=".example-scroll-target">
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <div class="example-scroll-target" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### Shape {#example-variant}

The `variant` attribute on the `<mdui-top-app-bar>` component sets the shape of the top app bar.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar variant="small" scroll-target=".example-variant" class="example-variant-bar">
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-variant" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">
      <mdui-segmented-button-group selects="single" value="small">
        <mdui-segmented-button value="center-aligned">center-aligned</mdui-segmented-button>
        <mdui-segmented-button value="small">small</mdui-segmented-button>
        <mdui-segmented-button value="medium">medium</mdui-segmented-button>
        <mdui-segmented-button value="large">large</mdui-segmented-button>
      </mdui-segmented-button-group>
    </div>
  </div>
</div>

<script>
  const topAppBar = document.querySelector(".example-variant-bar");
  const segmentedButtonGroup = document.querySelector(".example-variant");

  segmentedButtonGroup.addEventListener("change", (event) => {
    topAppBar.variant = event.target.value;
  });
</script>
```

### Scroll Behavior {#example-scroll-behavior}

The `scroll-behavior` attribute on the `<mdui-top-app-bar>` component defines the top app bar's behavior when the page is scrolled. You can use multiple scroll behaviors simultaneously by separating them with spaces.

Scroll behaviors include:

* `hide`: Hides the top app bar when scrolling down and shows it when scrolling up.
* `shrink`: Effective when `variant` is `medium` or `large`. Expands the top app bar when scrolling down and shrinks it when scrolling up.
* `elevate`: Adds a shadow to the top app bar when scrolling down and removes the shadow when scrolling back to the top.

The `scroll-threshold` attribute sets the number of pixels to start the scroll behavior of the top app bar. (Do not set the `scroll-threshold` attribute when using the `elevate` scroll behavior to respond promptly)

**Example: Hide on Scroll**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior-hide"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-hide" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**Example: Add Shadow on Scroll**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    scroll-behavior="elevate"
    scroll-target=".example-scroll-behavior-elevate"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-elevate" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**Example: Shrink on Scroll**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior-shrink"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-shrink" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**Example: Shrink and Add Shadow on Scroll**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink elevate"
    scroll-target=".example-scroll-behavior-shrink-elevate"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-shrink-elevate" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### Expanded State Text {#label-large}

For a top app bar with `variant` set to `medium` or `large`, and `scroll-behavior` set to `shrink`, you can use the `label-large` slot within the `<mdui-top-app-bar-title>` component to specify the text displayed in the expanded state.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink elevate"
    scroll-target=".example-label-large-slot"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>
      This is the collapsed state title
      <span slot="label-large">This is the expanded state title</span>
    </mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-label-large-slot" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

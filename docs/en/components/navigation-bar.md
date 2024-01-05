The navigation bar facilitates easy switching between main pages on mobile devices.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/navigation-bar.js';
import 'mdui/components/navigation-bar-item.js';
```

Import the TypeScript type:

```ts
import type { NavigationBar } from 'mdui/components/navigation-bar.js';
import type { NavigationBarItem } from 'mdui/components/navigation-bar-item.js';
```

Example: (Note: The `style="position: relative"` in the example is for demonstration purposes. Remove it in actual use.)

```html,example
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

**Note:**

By default, this component uses a `position: fixed` style and automatically adds a `padding-bottom` style to the `body` to prevent page content from being obscured. However, it uses a `position: absolute` style in the following cases:

1. When the `scroll-target` attribute is specified. In this case, `padding-bottom` is added to the specified element.
2. When it's inside the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, `padding-bottom` is not added.

## Examples {#examples}

### Label Visibility {#example-label-visibility}

Text labels in the navigation bar are always visible when there are 3 or fewer navigation items. If there are more than 3 items, only the text of the selected item is displayed.

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>

<br/>

<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="directions_railway" value="item-3">Item 3</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-4">Item 4</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

The `label-visibility` attribute on `<mdui-navigation-bar>` controls the visibility of text labels. Possible values:

* `selected`: Only the text of the selected item is displayed.
* `labeled`: Text is always displayed.
* `unlabeled`: Text is never displayed.

```html,example,expandable
<mdui-navigation-bar value="item-1" label-visibility="selected" style="position: relative" class="example-label">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>

<mdui-segmented-button-group value="selected" selects="single" style="margin-top: 16px">
  <mdui-segmented-button value="selected">selected</mdui-segmented-button>
  <mdui-segmented-button value="labeled">labeled</mdui-segmented-button>
  <mdui-segmented-button value="unlabeled">unlabeled</mdui-segmented-button>
</mdui-segmented-button-group>

<script>
  const navigationBar = document.querySelector(".example-label");
  const segmentedButtonGroup = navigationBar.nextElementSibling;

  segmentedButtonGroup.addEventListener("change", (event) => {
    navigationBar.labelVisibility = event.target.value;
  });
</script>
```

### In Container {#example-scroll-target}

By default, the navigation bar is relative to the current window and appears at the bottom of the page.

If you want to place the navigation bar within a specific container, use the `scroll-target` attribute on `<mdui-navigation-bar>`. The value should be the CSS selector or DOM element of the container with scrollable content. In this case, the navigation bar will be relative to the parent element. You need to manually add the styles `position: relative; overflow: hidden` to the parent element.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-navigation-bar scroll-target=".example-scroll-target" value="item-1">
    <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
  </mdui-navigation-bar>

  <div class="example-scroll-target" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">Page content</div>
  </div>
</div>
```

### Hide on Scroll {#example-scroll-behavior}

The `scroll-behavior` attribute on `<mdui-navigation-bar>` controls the visibility of the navigation bar during scrolling. Set its value to `hide` to hide the navigation bar when scrolling down and show it when scrolling up.

The `scroll-threshold` attribute sets the number of pixels to start hiding the navigation bar.

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-navigation-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior"
    value="item-1"
  >
    <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
  </mdui-navigation-bar>

  <div class="example-scroll-behavior" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">Page content</div>
  </div>
</div>
```

### Icons {#example-icon}

The `icon` attribute on `<mdui-navigation-bar-item>` sets the icon for the inactive state. The `active-icon` attribute sets the icon for the active state. Alternatively, use the `icon` and `active-icon` slots to set the icons for the inactive and active states.

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item
    icon="place--outlined"
    active-icon="place"
    value="item-1"
  >Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item value="item-2">
    Item 2
    <mdui-icon slot="icon" name="people--outlined"></mdui-icon>
    <mdui-icon slot="active-icon" name="people"></mdui-icon>
  </mdui-navigation-bar-item>
</mdui-navigation-bar>
```

### Link {#example-link}

Use the `href` attribute on the `<mdui-navigation-bar-item>` component to turn the navigation item into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" href="https://www.mdui.org" target="_blank" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

### Badge {#example-badge}

You can add a badge to the `<mdui-navigation-bar-item>` component using the `badge` slot.

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">
    Item 1
    <mdui-badge slot="badge">99+</mdui-badge>
  </mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

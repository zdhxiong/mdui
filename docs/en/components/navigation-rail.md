The navigation rail provides a means to access different primary pages on tablets and desktop computers.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/navigation-rail.js';
import 'mdui/components/navigation-rail-item.js';
```

Import the TypeScript type:

```ts
import type { NavigationRail } from 'mdui/components/navigation-rail.js';
import type { NavigationRailItem } from 'mdui/components/navigation-rail-item.js';
```

Example: (Note: The `style="position: relative"` in the example is for demonstration purposes, Remove it in actual use.)

```html,example
<mdui-navigation-rail value="recent" style="position: relative">
  <mdui-navigation-rail-item icon="watch_later--outlined" value="recent">Recent</mdui-navigation-rail-item>
  <mdui-navigation-rail-item icon="image--outlined" value="images">Images</mdui-navigation-rail-item>
  <mdui-navigation-rail-item icon="library_music--outlined" value="library">Library</mdui-navigation-rail-item>
</mdui-navigation-rail>
```

**Notes:**

By default, this component uses the `position: fixed` style and automatically adds `padding-left` or `padding-right` to the `body` to prevent content obscuration.

However, it defaults to `position: absolute` style in the following cases:

1. When the `contained` property of the `<mdui-navigation-rail>` component is `true`. In this case, it adds `padding-left` or `padding-right` style to the parent element.
2. When it's within the [`<mdui-layout></mdui-layout>`](/en/docs/2/components/layout) component. In this case, it doesn't add `padding-left` or `padding-right` style.

## Styles {#examples}

### In Container {#example-contained}

By default, the navigation rail displays on the left or right side of the current window. To place it inside a container, add the `contained` attribute to the `<mdui-navigation-rail>` component. This positions the navigation rail relative to the parent element (you need to manually add `position: relative` style to the parent element).

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Right Placement {#example-placement}

Set the `placement` attribute of the `<mdui-navigation-rail>` component to `right` to display the navigation rail on the right.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail placement="right" contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Display a Divider {#example-divider}

Add the `divider` attribute to the `<mdui-navigation-rail>` component to add a divider to the navigation rail, distinguishing it from the page content.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail divider contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Top/Bottom Elements {#example-top-bottom}

Inside the `<mdui-navigation-rail>` component, you can use the `top` and `bottom` slots to add elements at the top and bottom.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail contained>
    <mdui-button-icon icon="menu" slot="top"></mdui-button-icon>
    <mdui-fab lowered icon="edit--outlined" slot="top"></mdui-fab>
    <mdui-button-icon icon="settings" slot="bottom"></mdui-button-icon>

    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 600px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Vertical Alignment {#example-alignment}

Set the `alignment` attribute of the `<mdui-navigation-rail>` component to modify the vertical alignment of navigation items.

```html,example,expandable
<div class="example-alignment" style="position: relative">
  <mdui-navigation-rail alignment="start" contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 360px;overflow: auto">
    <mdui-segmented-button-group value="start" selects="single">
      <mdui-segmented-button value="start">start</mdui-segmented-button>
      <mdui-segmented-button value="center">center</mdui-segmented-button>
      <mdui-segmented-button value="end">end</mdui-segmented-button>
    </mdui-segmented-button-group>
  </div>
</div>

<script>
  const example = document.querySelector(".example-alignment");
  const navigationRail = example.querySelector("mdui-navigation-rail");
  const segmentedButtonGroup = example.querySelector("mdui-segmented-button-group");

  segmentedButtonGroup.addEventListener("change", (event) => {
    navigationRail.alignment = event.target.value;
  });
</script>
```

### Icons {#example-icon}

Use the `icon` attribute on the `<mdui-navigation-rail-item>` component to set the icon for the inactive state of the navigation item. The `active-icon` attribute sets the icon for the active state. Alternatively, use the `icon` and `active-icon` slots for the inactive and active states respectively.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined" active-icon="image--filled">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item>
      Library
      <mdui-icon slot="icon" name="library_music--outlined"></mdui-icon>
      <mdui-icon slot="active-icon" name="library_music--filled"></mdui-icon>
    </mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Icon Only {#example-no-label}

The `<mdui-navigation-rail-item>` component can display icons without labels.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail contained>
    <mdui-navigation-rail-item icon="watch_later--outlined"></mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined"></mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined"></mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Link {#example-link}

Use the `href` attribute on the `<mdui-navigation-rail-item>` component to turn the navigation item into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail divider contained>
    <mdui-navigation-rail-item
      href="https://www.mdui.org"
      target="_blank"
      icon="watch_later--outlined"
    >Recent</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

### Badge {#example-badge}

Add a badge to the `<mdui-navigation-rail-item>` component using the `badge` slot.

```html,example,expandable
<div style="position: relative">
  <mdui-navigation-rail contained>
    <mdui-navigation-rail-item icon="watch_later--outlined">
      Recent
      <mdui-badge slot="badge">99+</mdui-badge>
    </mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="image--outlined">Images</mdui-navigation-rail-item>
    <mdui-navigation-rail-item icon="library_music--outlined">Library</mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div style="height: 260px;overflow: auto">
    <div style="height: 1000px">Page Content</div>
  </div>
</div>
```

The segmented button group is a component that encapsulates a set of buttons. It is used to provide options, switch views, or sort elements.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/segmented-button-group.js';
import 'mdui/components/segmented-button.js';
```

Import the TypeScript type:

```ts
import type { SegmentedButtonGroup } from 'mdui/components/segmented-button-group.js';
import type { SegmentedButton } from 'mdui/components/segmented-button.js';
```

Example:

```html,example
<mdui-segmented-button-group>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

## Examples {#examples}

### Full Width {#example-full-width}

To make the component take up the full width of its container, add the `full-width` attribute to the `<mdui-segmented-button-group>` component.

```html,example,expandable
<mdui-segmented-button-group full-width>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### Single Selection {#example-selects-single}

To enable single selection mode, set the `selects` attribute of the `<mdui-segmented-button-group>` component to `single`. In this mode, the `value` property of `<mdui-segmented-button-group>` reflects the `value` property of the currently selected `<mdui-segmented-button>`.

```html,example,expandable
<mdui-segmented-button-group selects="single">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<mdui-segmented-button-group selects="single" value="week">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### Multiple Selection {#example-selects-multiple}

To enable multiple selection mode, set the `selects` attribute of the `<mdui-segmented-button-group>` component to `multiple`. In this mode, the `value` property of `<mdui-segmented-button-group>` is an array consisting of the `value` properties of the currently selected `<mdui-segmented-button>` components.

Note that when supporting multiple selection, the `value` property of `<mdui-segmented-button-group>` is an array, and it can only be read and set through JavaScript property.

```html,example,expandable
<mdui-segmented-button-group selects="multiple">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<mdui-segmented-button-group selects="multiple" class="demo-multiple">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<script>
  // Set the default selection to week and month
  const group = document.querySelector(".demo-multiple");
  group.value = ["week", "month"];
</script>
```

### Icons {#example-icon}

To add Material Icons on the left and right sides of the button, use the `icon` and `end-icon` attributes on the `<mdui-segmented-button>` element. Alternatively, use the `icon` and `end-icon` slots to add elements on the left and right sides of the button.

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button icon="search">Day</mdui-segmented-button>
  <mdui-segmented-button end-icon="arrow_forward">Week</mdui-segmented-button>
  <mdui-segmented-button>
    Month
    <mdui-icon slot="icon" name="downloading"></mdui-icon>
    <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
  </mdui-segmented-button>
</mdui-segmented-button-group>
```

To set the Material Icon for the selected state, use the `selected-icon` attribute on the `<mdui-segmented-button>` element. Alternatively, use the `selected-icon` slot.

```html,example,expandable
<mdui-segmented-button-group selects="multiple">
  <mdui-segmented-button value="day" selected-icon="cloud_done">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">
    <mdui-icon slot="selected-icon" name="cloud_done"></mdui-icon>
    Week
  </mdui-segmented-button>
</mdui-segmented-button-group>
```

### Link {#example-link}

To turn the button into a link, use the `href` attribute on the `<mdui-segmented-button>` component. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button href="https://www.mdui.org" target="_blank">Link</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### Disabled and Loading States {#example-disabled}

To disable the entire segmented button group, add the `disabled` attribute to the `<mdui-segmented-button-group>` element.

```html,example,expandable
<mdui-segmented-button-group disabled>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

To disable specific buttons, add the `disabled` attribute to the `<mdui-segmented-button>` element. To make a button enter the loading state, add the `loading` attribute.

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button disabled>Week</mdui-segmented-button>
  <mdui-segmented-button loading>Month</mdui-segmented-button>
  <mdui-segmented-button disabled loading>Year</mdui-segmented-button>
</mdui-segmented-button-group>
```

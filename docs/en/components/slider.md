Sliders provide a way for users to select from a range of values.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/slider.js';
```

Import the TypeScript type:

```ts
import type { Slider } from 'mdui/components/slider.js';
```

Example:

```html,example
<mdui-slider></mdui-slider>
```

## Examples {#examples}

### Default Value {#example-value}

The `value` property allows you to read or set the slider's value.

```html,example,expandable
<mdui-slider value="50"></mdui-slider>
```

### Disabled State {#example-disabled}

The `disabled` attribute can be used to disable the slider.

```html,example,expandable
<mdui-slider disabled></mdui-slider>
```

### Range {#example-min-max}

The `min` and `max` attributes allow you to set the slider's minimum and maximum values.

```html,example,expandable
<mdui-slider min="10" max="20"></mdui-slider>
```

### Step Interval {#example-step}

The `step` attribute allows you to set the slider's step interval.

```html,example,expandable
<mdui-slider step="10"></mdui-slider>
```

### Tickmarks {#example-tickmarks}

The `tickmarks` attribute can be used to add tickmarks to the slider.

```html,example,expandable
<mdui-slider tickmarks step="10"></mdui-slider>
```

### Hide Tooltip {#example-nolabel}

The `nolabel` attribute can be used to hide the slider's tooltip.

```html,example,expandable
<mdui-slider nolabel></mdui-slider>
```

### Modify Tooltip {#example-labelFormatter}

The `labelFormatter` property allows you to modify the tooltip's display format. This property is a function that takes the slider's current value as a parameter and returns the display text.

```html,example,expandable
<mdui-slider class="example-label-formatter"></mdui-slider>

<script>
  const slider = document.querySelector(".example-label-formatter");
  slider.labelFormatter = (value) => `${value} 小时`;
</script>
```

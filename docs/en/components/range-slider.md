The Range Slider component allows users to select a range from a series of values.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/range-slider.js';
```

Import the TypeScript type:

```ts
import type { RangeSlider } from 'mdui/components/range-slider.js';
```

Example:

```html,example
<mdui-range-slider></mdui-range-slider>
```

## Examples {#examples}

### Default Value {#example-value}

The `value` property represents the current value of the range slider. You can set the range slider's value by updating the `value` property. Note that the `value` property is an array and can only be accessed and modified through JavaScript property.

```html,example,expandable
<mdui-range-slider class="example-value"></mdui-range-slider>

<script>
  const slider = document.querySelector(".example-value");
  slider.value = [30, 70];
</script>
```

### Disabled State {#example-disabled}

The range slider can be disabled by adding the `disabled` attribute.

```html,example,expandable
<mdui-range-slider disabled></mdui-range-slider>
```

### Range {#example-min-max}

The `min` and `max` attributes allow you to set the minimum and maximum values of the range slider.

```html,example,expandable
<mdui-range-slider min="10" max="20"></mdui-range-slider>
```

### Step Interval {#example-step}

The `step` attribute defines the interval of the range slider.

```html,example,expandable
<mdui-range-slider step="10"></mdui-range-slider>
```

### Tickmarks {#example-tickmarks}

Tickmarks can be displayed on the range slider by adding the `tickmarks` attribute.

```html,example,expandable
<mdui-range-slider tickmarks step="10"></mdui-range-slider>
```

### Hide Tooltip {#example-nolabel}

The tooltip on the range slider can be hidden by adding the `nolabel` attribute.

```html,example,expandable
<mdui-range-slider nolabel></mdui-range-slider>
```

### Modify Tooltip {#example-labelFormatter}

The `labelFormatter` property allows you to customize the display format of the tooltip. This property is a function that takes the current value of the range slider as a parameter and returns the text you want to display.

```html,example,expandable
<mdui-range-slider class="example-label-formatter"></mdui-range-slider>

<script>
  const slider = document.querySelector(".example-label-formatter");
  slider.labelFormatter = (value) => `${value} hours`;
</script>
```

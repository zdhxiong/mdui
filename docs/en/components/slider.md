# Slider Component

Sliders allow users to select from a range of values.

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

```html,example,playgroundId=367
<mdui-slider></mdui-slider>
```

## Examples {#examples}

### Default Value {#example-value}

The `value` property lets you read or set the slider's value.

```html,example,expandable,playgroundId=368
<mdui-slider value="50"></mdui-slider>
```

### Disabled State {#example-disabled}

Add the `disabled` attribute to disable the slider.

```html,example,expandable,playgroundId=369
<mdui-slider disabled></mdui-slider>
```

### Range {#example-min-max}

Use the `min` and `max` attributes to set the slider's minimum and maximum values.

```html,example,expandable,playgroundId=370
<mdui-slider min="10" max="20"></mdui-slider>
```

### Step Interval {#example-step}

Use the `step` attribute to set the slider's step interval.

```html,example,expandable,playgroundId=371
<mdui-slider step="10"></mdui-slider>
```

### Tickmarks {#example-tickmarks}

Add the `tickmarks` attribute to show tickmarks on the slider.

```html,example,expandable,playgroundId=372
<mdui-slider tickmarks step="10"></mdui-slider>
```

### Hide Value Label {#example-nolabel}

Add the `nolabel` attribute to hide the value label.

```html,example,expandable,playgroundId=373
<mdui-slider nolabel></mdui-slider>
```

### Customize Value Label {#example-labelFormatter}

The `labelFormatter` property lets you customize the value label's display format. It takes the slider's current value and returns the text to display.

```html,example,expandable,playgroundId=374
<mdui-slider class="example-label-formatter"></mdui-slider>

<script>
  const slider = document.querySelector(".example-label-formatter");
  slider.labelFormatter = (value) => `${value} hours`;
</script>
```

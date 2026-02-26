# Select Component

The Select component presents options in a dropdown menu.

This guide focuses on the usage of the `<mdui-select>` component. For information on dropdown menu items, see the [`<mdui-menu-item>`](/en/docs/2/components/menu#menu-item-api) section.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/select.js';
import 'mdui/components/menu-item.js';
```

Import the TypeScript type:

```ts
import type { Select } from 'mdui/components/select.js';
import type { MenuItem } from 'mdui/components/menu-item.js';
```

Example:

```html,example,playgroundId=353
<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

## Examples {#examples}

### Variants {#example-variant}

Use the `variant` attribute to change the select's shape.

```html,example,expandable,playgroundId=354
<mdui-select variant="filled" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<mdui-select variant="outlined" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### Multiple Selection {#example-multiple}

By default, the component allows only a single selection. The `value` of the `<mdui-select>` component corresponds to the `value` of the currently selected [`<mdui-menu-item>`](/en/docs/2/components/menu#menu-item-api).

To allow multiple selections, add the `multiple` attribute. In this case, the `value` of `<mdui-select>` becomes an array containing the `value` properties of the currently selected [`<mdui-menu-item>`](/en/docs/2/components/menu#menu-item-api) components.

Note: When multiple selection is enabled, the `value` property of `<mdui-select>` is an array and can only be accessed and accessed and updated in JavaScript.

```html,example,expandable,playgroundId=355
<mdui-select multiple class="example-multiple">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-menu-item value="item-3">Item 3</mdui-menu-item>
</mdui-select>

<script>
  // Set default selection to item-1 and item-2
  const select = document.querySelector(".example-multiple");
  select.value = ["item-1", "item-2"];
</script>
```

### Helper Text {#example-helper-text}

Use the `label` attribute to display a label above the select.

```html,example,expandable,playgroundId=356
<mdui-select label="Text Field" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

Use the `placeholder` attribute to display placeholder text when no value is selected.

```html,example,expandable,playgroundId=357
<mdui-select placeholder="Placeholder">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

Use the `helper` attribute to display helper text at the bottom of the select. Alternatively, use the `helper` slot to provide helper text.

```html,example,expandable,playgroundId=358
<mdui-select helper="Supporting text">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<mdui-select>
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <span slot="helper" style="color: blue">Supporting text</span>
</mdui-select>
```

### Read-Only State {#example-readonly}

To make the select read-only, add the `readonly` attribute.

```html,example,expandable,playgroundId=359
<mdui-select readonly value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### Disabled State {#example-disabled}

To disable the select, add the `disabled` attribute.

```html,example,expandable,playgroundId=360
<mdui-select disabled value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### Clearable {#example-clearable}

The `clearable` attribute displays a clear button on the right when the select has a value.

```html,example,expandable,playgroundId=361
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

You can customize the clear button using the `clear` slot.

```html,example,expandable,playgroundId=362
<mdui-select clearable value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-icon slot="clear" name="delete"></mdui-icon>
</mdui-select>
```

### Dropdown Menu Position {#example-placement}

Use the `placement` attribute to set the dropdown menu position.

```html,example,expandable,playgroundId=363
<mdui-select placement="top" value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### Text Alignment {#example-end-aligned}

To align the text to the right, add the `end-aligned` attribute.

```html,example,expandable,playgroundId=364
<mdui-select end-aligned value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>
```

### Prefix, Suffix, and Icons {#example-prefix-suffix}

Use the `icon` and `end-icon` attributes to add Material Icons to the left and right of the select. Alternatively, use the `icon` and `end-icon` slots to add elements to the select.

```html,example,expandable,playgroundId=365
<mdui-select value="item-1" icon="search" end-icon="mic">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<br/><br/>

<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <mdui-button-icon slot="icon" icon="search"></mdui-button-icon>
  <mdui-button-icon slot="end-icon" icon="mic"></mdui-button-icon>
</mdui-select>
```

Use the `prefix` and `suffix` attributes to add text to the left and right of the select. Alternatively, use the `prefix` and `suffix` slots to add text elements. They appear when the select is focused or has a value.

```html,example,expandable,playgroundId=366
<mdui-select value="item-1" prefix="$" suffix="/100">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
</mdui-select>

<br/><br/>

<mdui-select value="item-1">
  <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
  <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
  <span slot="prefix" style="color: blue">$</span>
  <span slot="suffix" style="color: blue">/100</span>
</mdui-select>
```

Chips are compact elements that represent an input, attribute, or action.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/chip.js';
```

Import the TypeScript type:

```ts
import type { Chip } from 'mdui/components/chip.js';
```

Example:

```html,example
<mdui-chip>Chip</mdui-chip>
```

## Examples {#examples}

### Variant {#example-variant}

The `variant` attribute determines the chip's appearance. There are four available variants:

* `assist`: Represents smart or automated actions that can span multiple apps.
* `filter`: Represents filters for a collection.
* `input`: Represents discrete pieces of information entered by a user.
* `suggestion`: Helps narrow a user’s intent by presenting dynamically generated suggestions.

```html,example,expandable
<mdui-chip variant="assist">Assist</mdui-chip>
<mdui-chip variant="filter">Filter</mdui-chip>
<mdui-chip variant="input">Input</mdui-chip>
<mdui-chip variant="suggestion">Suggestion</mdui-chip>
```

### Elevated {#example-elevated}

Add the `elevated` attribute to raise the chip, providing it with a shadow.

```html,example,expandable
<mdui-chip elevated>Chip</mdui-chip>
```

### Icons {#example-icon}

Use the `icon` and `end-icon` attributes to add Material Icons to the left and right sides of the chip, respectively. Alternatively, use the `icon` and `end-icon` slots to add elements to the chip's sides.

```html,example,expandable
<mdui-chip icon="search">Icon</mdui-chip>
<mdui-chip end-icon="arrow_forward">End Icon</mdui-chip>
<mdui-chip>
  Slot
  <mdui-icon slot="icon" name="downloading"></mdui-icon>
  <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
</mdui-chip>
```

### Link {#example-link}

Use the `href` attribute to transform the chip into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-chip href="https://www.mdui.org" target="_blank">Link</mdui-chip>
```

### Disabled and Loading States {#example-disabled}

Use the `disabled` attribute to disable the chip. The `loading` attribute displays the loading state.

```html,example,expandable
<mdui-chip disabled>Disabled</mdui-chip>
<mdui-chip loading>Loading</mdui-chip>
<mdui-chip loading disabled>Loading & Disabled</mdui-chip>
```

### Selectable {#example-selectable}

Add the `selectable` attribute to make the chip selectable.

```html,example,expandable
<mdui-chip selectable>Chip</mdui-chip>
```

Use the `selected-icon` attribute to specify the Material Icons name for the selected state. Alternatively, use the `selected-icon` slot to specify the selected state icon element.

```html,example,expandable
<mdui-chip selectable selected-icon="favorite">Chip</mdui-chip>
<mdui-chip selectable>
  Chip
  <mdui-icon slot="selected-icon" name="favorite"></mdui-icon>
</mdui-chip>
```

The `selected` property is `true` when the chip is selected. Add the `selected` attribute to set the chip as selected by default.

```html,example,expandable
<mdui-chip selectable selected>Chip</mdui-chip>
```

### Deletable {#example-deletable}

Add the `deletable` attribute to add a delete icon to the right of the chip. Clicking this icon triggers the `delete` event. Use the `delete-icon` attribute to specify the Material Icons for the delete icon, or use the `delete-icon` slot to specify the element for the delete icon.

```html,example,expandable
<mdui-chip deletable>Chip</mdui-chip>
<mdui-chip deletable delete-icon="backspace">Chip</mdui-chip>
<mdui-chip deletable>
  Chip
  <mdui-icon slot="delete-icon" name="backspace"></mdui-icon>
</mdui-chip>
```

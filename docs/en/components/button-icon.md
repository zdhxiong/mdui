Icon buttons are used to execute minor actions with a single click.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/button-icon.js';
```

Import the TypeScript type:

```ts
import type { ButtonIcon } from 'mdui/components/button-icon.js';
```

Example:

```html,example
<mdui-button-icon icon="search"></mdui-button-icon>
```

## Examples {#examples}

### Icon {#example-icon}

Use the `icon` attribute to specify the Material Icons name. Alternatively, you can use the default slot to specify the icon element.

```html,example,expandable
<mdui-button-icon icon="search"></mdui-button-icon>
<mdui-button-icon>
  <mdui-icon name="search"></mdui-icon>
</mdui-button-icon>
```

### Shape {#example-variant}

The `variant` attribute determines the shape of the icon button.

```html,example,expandable
<mdui-button-icon variant="standard" icon="search"></mdui-button-icon>
<mdui-button-icon variant="filled" icon="search"></mdui-button-icon>
<mdui-button-icon variant="tonal" icon="search"></mdui-button-icon>
<mdui-button-icon variant="outlined" icon="search"></mdui-button-icon>
```

### Selectable {#example-selectable}

Add the `selectable` attribute to make the icon button selectable.

```html,example,expandable
<mdui-button-icon selectable icon="favorite_border"></mdui-button-icon>
```

Use the `selected-icon` attribute to specify the Material Icons name for the selected state. Alternatively, use the `selected-icon` slot to specify the selected state icon element.

```html,example,expandable
<mdui-button-icon selectable icon="favorite_border" selected-icon="favorite"></mdui-button-icon>
<mdui-button-icon selectable icon="favorite_border">
  <mdui-icon slot="selected-icon" name="favorite"></mdui-icon>
</mdui-button-icon>
```

The `selected` property is `true` when the icon button is selected. Add the `selected` attribute to set the icon button to the selected state by default.

```html,example,expandable
<mdui-button-icon selectable selected icon="favorite_border" selected-icon="favorite"></mdui-button-icon>
```

### Link {#example-link}

Use the `href` attribute to turn the icon button into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-button-icon icon="search" href="https://www.mdui.org" target="_blank"></mdui-button-icon>
```

### Disabled and Loading State {#example-disabled}

Use the `disabled` attribute to disable the icon button. The `loading` attribute displays the loading state.

```html,example,expandable
<mdui-button-icon disabled icon="search" variant="tonal"></mdui-button-icon>
<mdui-button-icon loading icon="search" variant="tonal"></mdui-button-icon>
<mdui-button-icon loading disabled icon="search" variant="tonal"></mdui-button-icon>
```

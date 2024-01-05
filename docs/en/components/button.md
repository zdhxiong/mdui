Buttons are interactive components that enable users to execute actions such as sending emails, sharing documents, or expressing preferences.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/button.js';
```

Import the TypeScript type:

```ts
import type { Button } from 'mdui/components/button.js';
```

Example:

```html,example
<mdui-button>Button</mdui-button>
```

## Examples {#examples}

### Variant {#example-variant}

The `variant` attribute determines the button's appearance.

```html,example,expandable
<mdui-button variant="elevated">Elevated</mdui-button>
<mdui-button variant="filled">Filled</mdui-button>
<mdui-button variant="tonal">Tonal</mdui-button>
<mdui-button variant="outlined">Outlined</mdui-button>
<mdui-button variant="text">Text</mdui-button>
```

### Full Width {#example-full-width}

Add the `full-width` attribute to make the button span the entire width of its container.

```html,example,expandable
<mdui-button full-width>Button</mdui-button>
```

### Icons {#example-icon}

Use the `icon` and `end-icon` attributes to add Material Icons to the left and right sides of the button, respectively. Alternatively, use the `icon` and `end-icon` slots to add custom elements to the button's sides.

```html,example,expandable
<mdui-button icon="search" end-icon="arrow_forward">Icon</mdui-button>
<mdui-button>
  Slot
  <mdui-icon slot="icon" name="downloading"></mdui-icon>
  <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
</mdui-button>
```

### Link {#example-link}

Use the `href` attribute to transform the button into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-button href="https://www.mdui.org" target="_blank">Link</mdui-button>
```

### Disabled and Loading States {#example-disabled}

Use the `disabled` attribute to disable the button. The `loading` attribute displays a loading state.

```html,example,expandable
<mdui-button disabled>Disabled</mdui-button>
<mdui-button loading>Loading</mdui-button>
<mdui-button loading disabled>Loading & Disabled</mdui-button>
```

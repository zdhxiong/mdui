The Floating Action Button (FAB) is a primary component for key actions, offering easy access.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/fab.js';
```

Import the TypeScript type:

```ts
import type { Fab } from 'mdui/components/fab.js';
```

Example:

```html,example
<mdui-fab icon="edit"></mdui-fab>
```

## Examples {#examples}

### Icon {#example-icon}

Set the Material Icon name with the `icon` attribute or use the `icon` slot.

```html,example,expandable
<mdui-fab icon="edit"></mdui-fab>
<mdui-fab>
  <mdui-icon slot="icon" name="edit"></mdui-icon>
</mdui-fab>
```

### Extended State {#example-extended}

Use `extended` to display text from the default slot in the extended state.

```html,example,expandable
<mdui-fab extended icon="edit">Compose</mdui-fab>
```

### Shape {#example-variant}

Set the FAB shape with the `variant` attribute.

```html,example,expandable
<mdui-fab variant="primary" icon="edit"></mdui-fab>
<mdui-fab variant="surface" icon="edit"></mdui-fab>
<mdui-fab variant="secondary" icon="edit"></mdui-fab>
<mdui-fab variant="tertiary" icon="edit"></mdui-fab>
```

### Size {#example-size}

Set the FAB size with the `size` attribute.

```html,example,expandable
<mdui-fab size="small" icon="edit"></mdui-fab>
<mdui-fab size="normal" icon="edit"></mdui-fab>
<mdui-fab size="large" icon="edit"></mdui-fab>
```

### Link {#example-link}

Use the `href` attribute to turn the FAB into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-fab icon="edit" href="https://www.mdui.org" target="_blank"></mdui-fab>
```

### Disabled and Loading State {#example-disabled}

Use `disabled` to disable the FAB. Use `loading` to add a loading state.

```html,example,expandable
<mdui-fab disabled icon="edit"></mdui-fab>
<mdui-fab loading icon="edit"></mdui-fab>
<mdui-fab loading disabled icon="edit"></mdui-fab>
```

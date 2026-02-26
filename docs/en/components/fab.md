# Floating Action Button Component

The Floating Action Button (FAB) is a primary action button that gives users quick access to key actions.

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

```html,example,playgroundId=262
<mdui-fab icon="edit"></mdui-fab>
```

## Examples {#examples}

### Icon {#example-icon}

Use the `icon` attribute to set the Material Icon name, or use the `icon` slot.

```html,example,expandable,playgroundId=263
<mdui-fab icon="edit"></mdui-fab>
<mdui-fab>
  <mdui-icon slot="icon" name="edit"></mdui-icon>
</mdui-fab>
```

### Extended State {#example-extended}

Use `extended` to show the default slot's text in the extended state.

```html,example,expandable,playgroundId=264
<mdui-fab extended icon="edit">Compose</mdui-fab>
```

### Shape {#example-variant}

Use the `variant` attribute to set the FAB shape.

```html,example,expandable,playgroundId=265
<mdui-fab variant="primary" icon="edit"></mdui-fab>
<mdui-fab variant="surface" icon="edit"></mdui-fab>
<mdui-fab variant="secondary" icon="edit"></mdui-fab>
<mdui-fab variant="tertiary" icon="edit"></mdui-fab>
```

### Size {#example-size}

Use the `size` attribute to set the FAB size.

```html,example,expandable,playgroundId=266
<mdui-fab size="small" icon="edit"></mdui-fab>
<mdui-fab size="normal" icon="edit"></mdui-fab>
<mdui-fab size="large" icon="edit"></mdui-fab>
```

### Link {#example-link}

Use the `href` attribute to turn the FAB into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable,playgroundId=267
<mdui-fab icon="edit" href="https://www.mdui.org" target="_blank"></mdui-fab>
```

### Disabled and Loading State {#example-disabled}

Use `disabled` to disable the FAB. Use `loading` to show a loading state.

```html,example,expandable,playgroundId=268
<mdui-fab disabled icon="edit"></mdui-fab>
<mdui-fab loading icon="edit"></mdui-fab>
<mdui-fab loading disabled icon="edit"></mdui-fab>
```

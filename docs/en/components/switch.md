# Switch Component

The Switch component toggles a single setting on or off.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/switch.js';
```

Import the TypeScript type:

```ts
import type { Switch } from 'mdui/components/switch.js';
```

Example:

```html,example,playgroundId=385
<mdui-switch></mdui-switch>
```

## Examples {#examples}

### Checked State {#example-checked}

The `checked` attribute indicates whether the switch is on or off. Add the `checked` attribute to turn it on by default.

```html,example,expandable,playgroundId=386
<mdui-switch checked></mdui-switch>
```

### Disabled State {#example-disabled}

Use the `disabled` attribute to disable the switch.

```html,example,expandable,playgroundId=387
<mdui-switch disabled></mdui-switch>
<mdui-switch disabled checked></mdui-switch>
```

### Icons {#example-icon}

Use the `unchecked-icon` and `checked-icon` attributes to set the Material Icons for the unchecked and checked states, respectively. Alternatively, use the `unchecked-icon` and `checked-icon` slots to set the icons for the unchecked and checked states.

```html,example,expandable,playgroundId=388
<mdui-switch unchecked-icon="remove_moderator" checked-icon="verified_user"></mdui-switch>
<mdui-switch>
  <mdui-icon slot="unchecked-icon" name="remove_moderator"></mdui-icon>
  <mdui-icon slot="checked-icon" name="verified_user"></mdui-icon>
</mdui-switch>
```

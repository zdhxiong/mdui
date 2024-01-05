The Switch component is utilized to toggle the state of a single setting between on and off.

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

```html,example
<mdui-switch></mdui-switch>
```

## Examples {#examples}

### Checked State {#example-checked}

The `checked` attribute indicates whether the switch is on or off. To set the switch to the on state by default, add the `checked` attribute.

```html,example,expandable
<mdui-switch checked></mdui-switch>
```

### Disabled State {#example-disabled}

The `disabled` attribute can be used to disable the switch.

```html,example,expandable
<mdui-switch disabled></mdui-switch>
<mdui-switch disabled checked></mdui-switch>
```

### Icons {#example-icon}

The `unchecked-icon` and `checked-icon` attributes can be used to set the Material Icons for the unchecked and checked states, respectively. Alternatively, the `unchecked-icon` and `checked-icon` slots can be used to set the icons for the unchecked and checked states.

```html,example,expandable
<mdui-switch unchecked-icon="remove_moderator" checked-icon="verified_user"></mdui-switch>
<mdui-switch>
  <mdui-icon slot="unchecked-icon" name="remove_moderator"></mdui-icon>
  <mdui-icon slot="checked-icon" name="verified_user"></mdui-icon>
</mdui-switch>
```

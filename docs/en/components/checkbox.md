Checkboxes allow users to select one or more options from a set. Each checkbox can toggle between checked and unchecked states.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/checkbox.js';
```

Import the TypeScript type:

```ts
import type { Checkbox } from 'mdui/components/checkbox.js';
```

Example:

```html,example
<mdui-checkbox>Checkbox</mdui-checkbox>
```

## Examples {#examples}

### Checked State {#example-checked}

The `checked` property is `true` when the checkbox is checked. Add the `checked` attribute to set the checkbox to the checked state by default.

```html,example,expandable
<mdui-checkbox checked>Checkbox</mdui-checkbox>
```

### Disabled State {#example-disabled}

Use the `disabled` attribute to disable the checkbox.

```html,example,expandable
<mdui-checkbox disabled>Checkbox</mdui-checkbox>
<mdui-checkbox disabled checked>Checkbox</mdui-checkbox>
```

### Indeterminate State {#example-indeterminate}

The `indeterminate` attribute indicates an indeterminate state for the checkbox.

```html,example,expandable
<mdui-checkbox indeterminate>Checkbox</mdui-checkbox>
```

### Icons {#example-icon}

Use the `unchecked-icon`, `checked-icon`, and `indeterminate-icon` attributes to set Material Icons for the checkbox in unchecked, checked, and indeterminate states, respectively. Alternatively, use the corresponding slots for setting icons.

```html,example,expandable
<mdui-checkbox
  unchecked-icon="radio_button_unchecked"
  checked-icon="check_circle"
  indeterminate-icon="playlist_add_check_circle"
>Checkbox</mdui-checkbox>

<mdui-checkbox
  indeterminate
  unchecked-icon="radio_button_unchecked"
  checked-icon="check_circle"
  indeterminate-icon="playlist_add_check_circle"
>Checkbox</mdui-checkbox>

<br/>

<mdui-checkbox>
  <mdui-icon slot="unchecked-icon" name="radio_button_unchecked"></mdui-icon>
  <mdui-icon slot="checked-icon" name="check_circle"></mdui-icon>
  <mdui-icon slot="indeterminate-icon" name="playlist_add_check_circle"></mdui-icon>
  Checkbox
</mdui-checkbox>

<mdui-checkbox indeterminate>
  <mdui-icon slot="unchecked-icon" name="radio_button_unchecked"></mdui-icon>
  <mdui-icon slot="checked-icon" name="check_circle"></mdui-icon>
  <mdui-icon slot="indeterminate-icon" name="playlist_add_check_circle"></mdui-icon>
  Checkbox
</mdui-checkbox>
```

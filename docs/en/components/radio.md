The radio group component is designed for selecting a single option from a set of options.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/radio-group.js';
import 'mdui/components/radio.js';
```

Import the TypeScript type:

```ts
import type { RadioGroup } from 'mdui/components/radio-group.js';
import type { Radio } from 'mdui/components/radio.js';
```

Example:

```html,example
<mdui-radio-group value="chinese">
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

## Examples {#examples}

### Checked State {#example-checked}

The `value` property of the `<mdui-radio-group>` component corresponds to the `value` of the currently selected `<mdui-radio>` component. You can change the selected radio button by updating the `value` property of the `<mdui-radio-group>` component.

```html,example,expandable
<mdui-radio-group value="chinese">
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

The `<mdui-radio>` component can also be used independently. In this case, use the `checked` property to access and modify the checked state.

```html,example,expandable
<mdui-radio checked>Radio</mdui-radio>
```

### Disabled State {#example-disabled}

To disable the entire radio group, add the `disabled` attribute to the `<mdui-radio-group>` component.

```html,example,expandable
<mdui-radio-group disabled>
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english">English</mdui-radio>
</mdui-radio-group>
```

To disable a specific radio button, add the `disabled` attribute to the `<mdui-radio>` component.

```html,example,expandable
<mdui-radio-group>
  <mdui-radio value="chinese">Chinese</mdui-radio>
  <mdui-radio value="english" disabled>English</mdui-radio>
</mdui-radio-group>
```

### Icons {#example-icon}

You can set Material Icons for the unchecked and checked states of the radio button using the `unchecked-icon` and `checked-icon` attributes, respectively. Alternatively, you can use the `unchecked-icon` and `checked-icon` slots.

```html,example,expandable
<mdui-radio-group value="chinese">
  <mdui-radio
    unchecked-icon="check_box_outline_blank"
    checked-icon="lock"
    value="chinese"
  >Chinese</mdui-radio>
  <mdui-radio value="english">
    <mdui-icon slot="unchecked-icon" name="check_box_outline_blank"></mdui-icon>
    <mdui-icon slot="checked-icon" name="lock"></mdui-icon>
    English
  </mdui-radio>
</mdui-radio-group>
```

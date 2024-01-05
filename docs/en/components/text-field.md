Text fields, typically used in forms and dialogs, allow users to input text.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/text-field.js';
```

Import the TypeScript type:

```ts
import type { TextField } from 'mdui/components/text-field.js';
```

Example:

```html,example
<mdui-text-field label="Text Field"></mdui-text-field>
```

## Examples {#examples}

### Variant {#example-variant}

The `variant` attribute modifies the shape of the text field.

```html,example,expandable
<mdui-text-field variant="filled" label="Text Field"></mdui-text-field>
<mdui-text-field variant="outlined" label="Text Field"></mdui-text-field>
```

### Helper Text {#example-helper-text}

The `label` attribute sets the label text above the text field.

```html,example,expandable
<mdui-text-field label="Text Field"></mdui-text-field>
```

The `placeholder` attribute sets the placeholder text when there is no value.

```html,example,expandable
<mdui-text-field label="Text Field" placeholder="Placeholder"></mdui-text-field>
```

The `helper` attribute or `helper` slot sets the helper text at the bottom of the text field. To display the helper text only when the input is focused, use the `helper-on-focus` attribute.

```html,example,expandable
<mdui-text-field label="Text Field" helper="Supporting text"></mdui-text-field>

<mdui-text-field label="Text Field">
  <span slot="helper" style="color: blue">Supporting text</span>
</mdui-text-field>

<mdui-text-field label="Text Field" helper="Supporting text" helper-on-focus></mdui-text-field>
```

### Clearable {#example-clearable}

The `clearable` attribute adds a clear button on the right when the text field has a value.

```html,example,expandable
<mdui-text-field clearable label="Text Field" value="Input Text"></mdui-text-field>
```

### End-Aligned Text {#example-end-aligned}

The `end-aligned` attribute aligns the text to the right.

```html,example,expandable
<mdui-text-field end-aligned label="Text Field" value="Input Text"></mdui-text-field>
```

### Prefix, Suffix, Icons {#example-prefix-suffix}

The `icon` and `end-icon` attributes or slots add Material Icons to the left and right of the text field, respectively.

```html,example,expandable
<mdui-text-field icon="search" end-icon="mic" label="Text Field"></mdui-text-field>

<br/><br/>

<mdui-text-field label="Text Field">
  <mdui-button-icon slot="icon" icon="search"></mdui-button-icon>
  <mdui-button-icon slot="end-icon" icon="mic"></mdui-button-icon>
</mdui-text-field>
```

The `prefix` and `suffix` attributes or slots add text to the left and right of the text field. This text is displayed only when the text field is focused or has a value.

```html,example,expandable
<mdui-text-field prefix="$" suffix="/100" label="Text Field"></mdui-text-field>

<br/><br/>

<mdui-text-field label="Text Field">
  <span slot="prefix" style="color: blue">$</span>
  <span slot="suffix" style="color: blue">/100</span>
</mdui-text-field>
```

### Readonly {#example-readonly}

The `readonly` attribute makes the text field read-only.

```html,example,expandable
<mdui-text-field readonly label="Text Field" value="Input Text"></mdui-text-field>
```

### Disabled {#example-disabled}

The `disabled` attribute disables the text field.

```html,example,expandable
<mdui-text-field disabled label="Text Field" value="Input Text"></mdui-text-field>
```

### Multi-line Text Field {#example-rows}

The `rows` attribute sets the number of rows for a multi-line text field.

```html,example,expandable
<mdui-text-field rows="3" label="Text Field"></mdui-text-field>
```

To automatically adjust the height of the text field based on the length of the input, use the `autosize` attribute. The `min-rows` and `max-rows` attributes specify the minimum and maximum number of rows.

```html,example,expandable
<mdui-text-field autosize label="Text Field"></mdui-text-field>

<mdui-text-field autosize min-rows="2" max-rows="5" label="Text Field"></mdui-text-field>
```

### Character Counter {#example-counter}

The `maxlength` attribute sets the maximum number of characters for the text field. To display a character counter below the text field, use the `counter` attribute.

```html,example,expandable
<mdui-text-field maxlength="20" counter label="Text Field"></mdui-text-field>
```

### Password Field {#example-password}

For password fields (`type="password"`), the `toggle-password` attribute adds a button on the right to toggle the visibility of the password.

```html,example,expandable
<mdui-text-field type="password" toggle-password label="Text Field"></mdui-text-field>
```

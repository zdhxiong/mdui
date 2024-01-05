A divider is a thin line that groups content in lists and layouts.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/divider.js';
```

Import the TypeScript type:

```ts
import type { Divider } from 'mdui/components/divider.js';
```

Example:

```html,example
<mdui-divider></mdui-divider>
```

## Examples {#examples}

### Vertical Divider {#example-vertical}

To display the divider vertically, add the `vertical` attribute.

```html,example,expandable
<div style="height: 80px;padding: 0 20px">
  <mdui-divider vertical></mdui-divider>
</div>
```

### Left Inset {#example-inset}

To inset the divider from the left, add the `inset` attribute. This is typically used in lists to align the divider with the text on the left.

```html,example,expandable
<mdui-list>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-divider inset></mdui-divider>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

### Middle Inset {#example-middle}

To inset the divider from both sides, add the `middle` attribute.

```html,example,expandable
<mdui-list>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-divider middle></mdui-divider>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

Cards are versatile components that serve as containers for content and actions about a single subject.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/card.js';
```

Import the TypeScript type:

```ts
import type { Card } from 'mdui/components/card.js';
```

Example:

```html,example
<mdui-card style="width: 200px;height: 124px">Card</mdui-card>
```

## Examples {#examples}

### Variant {#example-variant}

The `variant` attribute determines the card's appearance.

```html,example,expandable
<mdui-card variant="elevated" style="width: 200px;height: 124px"></mdui-card>
<mdui-card variant="filled" style="width: 200px;height: 124px"></mdui-card>
<mdui-card variant="outlined" style="width: 200px;height: 124px"></mdui-card>
```

### Clickable {#example-clickable}

Add the `clickable` attribute to make the card interactive. This will add hover and click ripple effects.

```html,example,expandable
<mdui-card clickable style="width: 200px;height: 124px"></mdui-card>
```

### Link {#example-link}

Use the `href` attribute to transform the card into a link. The `download`, `target`, and `rel` attributes are available for link-related functionality.

```html,example,expandable
<mdui-card href="https://www.mdui.org" target="_blank" style="width: 200px;height: 124px"></mdui-card>
```

### Disabled State {#example-disabled}

Use the `disabled` attribute to disable the card.

```html,example,expandable
<mdui-card disabled style="width: 200px;height: 124px"></mdui-card>
```

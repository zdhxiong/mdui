Circular progress indicators are used to show the progress of ongoing tasks.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/circular-progress.js';
```

Import the TypeScript type:

```ts
import type { CircularProgress } from 'mdui/components/circular-progress.js';
```

Example:

```html,example
<mdui-circular-progress></mdui-circular-progress>
```

## Examples {#examples}

### Determinate Progress  {#example-value}

By default, the circular progress indicator is in an indeterminate state. To set the current progress, use the `value` attribute. The default maximum progress value is `1`.

```html,example,expandable
<mdui-circular-progress value="0.5"></mdui-circular-progress>
```

To set the maximum progress value, use the `max` attribute.

```html,example,expandable
<mdui-circular-progress value="30" max="100"></mdui-circular-progress>
```

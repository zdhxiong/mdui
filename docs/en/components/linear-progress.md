Linear progress indicators are horizontal bars that display the status of ongoing operations, such as data loading or form submission.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/linear-progress.js';
```

Import the TypeScript type:

```ts
import type { LinearProgress } from 'mdui/components/linear-progress.js';
```

Example:

```html,example
<mdui-linear-progress></mdui-linear-progress>
```

## Examples {#examples}

### Determinate Progress {#example-value}

By default, the linear progress indicator is in an indeterminate state. Use the `value` attribute to set the current progress. The default maximum progress value is `1`.

```html,example,expandable
<mdui-linear-progress value="0.5"></mdui-linear-progress>
```

Set the maximum progress value with the `max` attribute.

```html,example,expandable
<mdui-linear-progress value="30" max="100"></mdui-linear-progress>
```

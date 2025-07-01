Badges provide dynamic information, such as counts or status indications. They can contain labels or numbers.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/badge.js';
```

Import the TypeScript type:

```ts
import type { Badge } from 'mdui/components/badge.js';
```

example:

```html,example,playgroundId=191
<mdui-badge>12</mdui-badge>
```

## Examples {#examples}

### Variants {#example-variant}

The `variant` attribute determines the badge's shape. A `large` value creates a larger badge. Specify the content to display within the default slot.

```html,example,expandable,playgroundId=192
<mdui-badge variant="small"></mdui-badge>
<mdui-badge variant="large">99+</mdui-badge>
```

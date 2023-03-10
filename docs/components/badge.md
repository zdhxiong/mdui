徽标用于传达动态信息，例如用于计数或表示状态。它可以包含标签或数字。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/badge.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Badge } from 'mdui/components/badge.js';
```

使用示例：

```html,example
<mdui-badge>12</mdui-badge>
```

## 示例 {#examples}

### 形状 {#example-variant}

使用 `variant` 属性设置徽标的形状。为 `large` 时为大徽标，可在 default slot 中指定要显示的文案。

```html,example,expandable
<mdui-badge variant="small"></mdui-badge>
<mdui-badge variant="large">99+</mdui-badge>
```

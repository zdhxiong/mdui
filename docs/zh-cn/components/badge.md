徽标用于展示动态信息，如计数或状态指示。它可以包含文字或数字。

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

使用 `variant` 属性来设置徽标的形状。当 `variant` 为 `large` 时，将显示大型徽标。你可以在 default slot 中指定要显示的文本。

```html,example,expandable
<mdui-badge variant="small"></mdui-badge>
<mdui-badge variant="large">99+</mdui-badge>
```

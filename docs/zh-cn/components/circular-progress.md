圆形进度指示器是一个圆形的指示器，用于通知用户正在进行的任务的状态，例如正在加载数据或提交表单等。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/circular-progress.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { CircularProgress } from 'mdui/components/circular-progress.js';
```

使用示例：

```html,example
<mdui-circular-progress></mdui-circular-progress>
```

## 示例 {#examples}

### 固定进度 {#example-value}

圆形进度指示器默认为不确定进度，可通过 `value` 属性设置当前进度，默认进度最大值为 1。

```html,example,expandable
<mdui-circular-progress value="0.5"></mdui-circular-progress>
```

可通过 `max` 属性设置进度最大值。

```html,example,expandable
<mdui-circular-progress value="30" max="100"></mdui-circular-progress>
```

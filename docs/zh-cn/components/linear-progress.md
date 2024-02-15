线性进度指示器是一种横向的指示器，用于向用户展示任务的执行进度，如数据加载或表单提交等。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/linear-progress.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { LinearProgress } from 'mdui/components/linear-progress.js';
```

使用示例：

```html,example
<mdui-linear-progress></mdui-linear-progress>
```

## 示例 {#examples}

### 设定进度 {#example-value}

线性进度指示器默认为不确定的进度，你可以通过 `value` 属性来设定当前的进度，默认的进度最大值为 `1`。

```html,example,expandable
<mdui-linear-progress value="0.5"></mdui-linear-progress>
```

你也可以通过 `max` 属性来设定进度的最大值。

```html,example,expandable
<mdui-linear-progress value="30" max="100"></mdui-linear-progress>
```

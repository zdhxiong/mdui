分隔线是一条细线，用于在列表和容器中对内容进行分组。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/divider.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Divider } from 'mdui/components/divider.js';
```

使用示例：

```html,example
<mdui-divider></mdui-divider>
```

## 示例 {#examples}

### 垂直分割线 {#example-vertical}

添加 `vertical` 属性，可以使分割线垂直显示。

```html,example,expandable
<div style="height: 80px;padding: 0 20px">
  <mdui-divider vertical></mdui-divider>
</div>
```

### 左侧缩进 {#example-inset}

添加 `inset` 属性，可以使分割线左侧缩进。这通常用于列表中，以使分割线和左侧文本对齐。

```html,example,expandable
<mdui-list>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-divider inset></mdui-divider>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

### 两侧缩进 {#example-middle}

添加 `middle` 属性，可以使分割线两侧缩进。

```html,example,expandable
<mdui-list>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-divider middle></mdui-divider>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

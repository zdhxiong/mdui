卡片用于包含有关单个主题的内容和相关操作。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/card.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Card } from 'mdui/components/card.js';
```

使用示例：

```html,example
<mdui-card style="width: 200px;height: 124px">Card</mdui-card>
```

## 示例 {#examples}

### 形状 {#example-variant}

使用 `variant` 属性设置卡片的形状。

```html,example,expandable
<mdui-card variant="elevated" style="width: 200px;height: 124px"></mdui-card>
<mdui-card variant="filled" style="width: 200px;height: 124px"></mdui-card>
<mdui-card variant="outlined" style="width: 200px;height: 124px"></mdui-card>
```

### 可点击 {#example-clickable}

添加 `clickable` 属性使卡片可被点击，此时会添加鼠标悬浮、及点击涟漪效果。

```html,example,expandable
<mdui-card clickable style="width: 200px;height: 124px"></mdui-card>
```

### 链接 {#example-link}

添加 `href` 属性，可使卡片变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-card href="https://www.mdui.org" target="_blank" style="width: 200px;height: 124px"></mdui-card>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可禁用卡片。

```html,example,expandable
<mdui-card disabled style="width: 200px;height: 124px"></mdui-card>
```

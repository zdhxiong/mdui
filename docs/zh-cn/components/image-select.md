# 图片选择组件 ImageSelect

图片选择组件允许用户从一组图片中选择一个或多个。选中时会显示一个勾选指示器。可配合 `<mdui-image-select-group>` 组件使用，以管理多个项目的选中状态。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/image-select.js';
import 'mdui/components/image-select-group.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { ImageSelect } from 'mdui/components/image-select.js';
import type { ImageSelectGroup } from 'mdui/components/image-select-group.js';
```

使用示例：

```html,example
<mdui-image-select-group selects="multiple">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

## 示例 {#examples}

### 独立使用 {#example-standalone}

`<mdui-image-select>` 组件可以独立使用，不需要放在组中。点击即可切换选中状态。

```html,example,expandable
<mdui-image-select src="https://via.placeholder.com/200" style="width: 200px; height: 200px"></mdui-image-select>
```

### 多选模式 {#example-selects-multiple}

在 `<mdui-image-select-group>` 元素上指定 `selects` 属性为 `multiple`（默认值），可以实现多选模式。此时 `<mdui-image-select-group>` 的 `value` 属性值为当前选中的 `<mdui-image-select>` 的 `value` 属性的值组成的数组。

注意：在多选模式下，`<mdui-image-select-group>` 的 `value` 属性值为数组，只能通过 JavaScript 属性来读取和设置该值。

```html,example,expandable
<mdui-image-select-group selects="multiple">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

### 单选模式 {#example-selects-single}

在 `<mdui-image-select-group>` 元素上指定 `selects` 属性为 `single`，可以实现单选模式。此时 `<mdui-image-select-group>` 的 `value` 属性值即为当前选中的 `<mdui-image-select>` 的 `value` 属性的值。

```html,example,expandable
<mdui-image-select-group selects="single">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

### 网格列数 {#example-columns}

在 `<mdui-image-select-group>` 上使用 `--columns` CSS 自定义属性来控制网格列数。默认值为 `3`。

```html,example,expandable
<mdui-image-select-group selects="multiple" style="--columns: 4">
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="4"></mdui-image-select>
</mdui-image-select-group>
```

### 图片适应方式 {#example-fit}

使用 `fit` 属性来控制图片在容器中的适应方式。可选值为 `contain`、`cover`（默认）、`fill`、`none` 和 `scale-down`。

```html,example,expandable
<mdui-image-select src="https://via.placeholder.com/400x200" fit="contain" style="width: 200px; height: 200px"></mdui-image-select>
<mdui-image-select src="https://via.placeholder.com/400x200" fit="cover" style="width: 200px; height: 200px"></mdui-image-select>
<mdui-image-select src="https://via.placeholder.com/400x200" fit="fill" style="width: 200px; height: 200px"></mdui-image-select>
```

### 自定义内容 {#example-slot}

使用默认 slot 来提供自定义内容，代替 `src` 属性。

```html,example,expandable
<mdui-image-select style="width: 200px; height: 200px">
  <img src="https://via.placeholder.com/200" alt="自定义图片" style="width: 100%; height: 100%; object-fit: cover" />
</mdui-image-select>
```

### 禁用状态 {#example-disabled}

在 `<mdui-image-select-group>` 元素上添加 `disabled` 属性可以禁用所有项目，或在单个 `<mdui-image-select>` 元素上添加 `disabled` 属性可以禁用特定项目。

```html,example,expandable
<mdui-image-select-group selects="multiple" disabled>
  <mdui-image-select src="https://via.placeholder.com/200" value="1"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="2"></mdui-image-select>
  <mdui-image-select src="https://via.placeholder.com/200" value="3"></mdui-image-select>
</mdui-image-select-group>
```

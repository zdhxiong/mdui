滑块用于让用户从一系列值中进行选择。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/slider.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Slider } from 'mdui/components/slider.js';
```

使用示例：

```html,example
<mdui-slider></mdui-slider>
```

## 示例 {#examples}

### 默认值 {#example-value}

可通过 `value` 属性读取滑块当前值；或设置 `value` 属性来修改滑块的值。

```html,example,expandable
<mdui-slider value="50"></mdui-slider>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可禁用滑块。

```html,example,expandable
<mdui-slider disabled></mdui-slider>
```

### 范围 {#example-min-max}

使用 `min` 和 `max` 属性设置滑块的最小值和最大值。

```html,example,expandable
<mdui-slider min="10" max="20"></mdui-slider>
```

### 步进间隔 {#example-step}

使用 `step` 属性设置滑块的步进间隔。

```html,example,expandable
<mdui-slider step="10"></mdui-slider>
```

### 刻度标记 {#example-tickmarks}

添加 `tickmarks` 属性在滑块上添加刻度标记。

```html,example,expandable
<mdui-slider tickmarks step="10"></mdui-slider>
```

### 隐藏文本提示 {#example-nolabel}

添加 `nolabel` 属性可隐藏滑块上的文本提示。

```html,example,expandable
<mdui-slider nolabel></mdui-slider>
```

### 修改文本提示 {#example-labelFormatter}

可通过 `labelFormatter` JavaScript 属性修改文本提示的显示格式。该属性值是一个函数，函数参数为当前滑块的值，返回值为你期望显示的文本。

```html,example,expandable
<mdui-slider class="example-label-formatter"></mdui-slider>

<script>
  const slider = document.querySelector(".example-label-formatter");
  slider.labelFormatter = (value) => `${value} 小时`;
</script>
```

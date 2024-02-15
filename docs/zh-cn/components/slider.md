滑块组件允许用户在一系列值中进行选择。

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

通过 `value` 属性，可以读取或设置滑块的当前值。

```html,example,expandable
<mdui-slider value="50"></mdui-slider>
```

### 禁用状态 {#example-disabled}

添加 `disabled` 属性可以禁用滑块。

```html,example,expandable
<mdui-slider disabled></mdui-slider>
```

### 范围 {#example-min-max}

使用 `min` 和 `max` 属性来设置滑块的最小值和最大值。

```html,example,expandable
<mdui-slider min="10" max="20"></mdui-slider>
```

### 步进间隔 {#example-step}

通过 `step` 属性，你可以设置滑块的步进间隔。

```html,example,expandable
<mdui-slider step="10"></mdui-slider>
```

### 刻度标记 {#example-tickmarks}

添加 `tickmarks` 属性，可以在滑块上显示刻度标记。

```html,example,expandable
<mdui-slider tickmarks step="10"></mdui-slider>
```

### 隐藏文本提示 {#example-nolabel}

如果你想隐藏滑块上的文本提示，可以添加 `nolabel` 属性。

```html,example,expandable
<mdui-slider nolabel></mdui-slider>
```

### 修改文本提示 {#example-labelFormatter}

可以通过 `labelFormatter` JavaScript 属性来修改文本提示的显示格式。这个属性的值应该是一个函数，该函数接收当前滑块的值作为参数，返回你希望显示的文本。

```html,example,expandable
<mdui-slider class="example-label-formatter"></mdui-slider>

<script>
  const slider = document.querySelector(".example-label-formatter");
  slider.labelFormatter = (value) => `${value} 小时`;
</script>
```

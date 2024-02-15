分段按钮组件封装了一组按钮，用于提供选项、切换视图或对元素进行排序等。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/segmented-button-group.js';
import 'mdui/components/segmented-button.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { SegmentedButtonGroup } from 'mdui/components/segmented-button-group.js';
import type { SegmentedButton } from 'mdui/components/segmented-button.js';
```

使用示例：

```html,example
<mdui-segmented-button-group>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

## 示例 {#examples}

### 全宽显示 {#example-full-width}

在 `<mdui-segmented-button-group>` 元素上添加 `full-width` 属性，可使组件占据全部宽度。

```html,example,expandable
<mdui-segmented-button-group full-width>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### 单选模式 {#example-selects-single}

在 `<mdui-segmented-button-group>` 元素上指定 `selects` 属性为 `single`，可以实现单选模式。此时 `<mdui-segmented-button-group>` 的 `value` 属性值即为当前选中的 `<mdui-segmented-button>` 的 `value` 属性的值。

```html,example,expandable
<mdui-segmented-button-group selects="single">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<mdui-segmented-button-group selects="single" value="week">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### 多选模式 {#example-selects-multiple}

在 `<mdui-segmented-button-group>` 元素上指定 `selects` 属性为 `multiple`，可以实现多选模式。此时 `<mdui-segmented-button-group>` 的 `value` 属性值为当前选中的 `<mdui-segmented-button>` 的 `value` 属性的值组成的数组。

注意：在多选模式下，`<mdui-segmented-button-group>` 的 `value` 属性值为数组，只能通过 JavaScript 属性来读取和设置该值。

```html,example,expandable
<mdui-segmented-button-group selects="multiple">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<mdui-segmented-button-group selects="multiple" class="demo-multiple">
  <mdui-segmented-button value="day">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">Week</mdui-segmented-button>
  <mdui-segmented-button value="month">Month</mdui-segmented-button>
</mdui-segmented-button-group>

<script>
  // 设置默认选中 week 和 month
  const group = document.querySelector(".demo-multiple");
  group.value = ["week", "month"];
</script>
```

### 图标 {#example-icon}

在 `<mdui-segmented-button>` 元素上，通过设置 `icon` 和 `end-icon` 属性，可以在按钮的左侧和右侧添加 Material Icons 图标。另外，也可以通过 `icon` 和 `end-icon` slot 在按钮的左侧和右侧添加元素。

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button icon="search">Day</mdui-segmented-button>
  <mdui-segmented-button end-icon="arrow_forward">Week</mdui-segmented-button>
  <mdui-segmented-button>
    Month
    <mdui-icon slot="icon" name="downloading"></mdui-icon>
    <mdui-icon slot="end-icon" name="attach_file"></mdui-icon>
  </mdui-segmented-button>
</mdui-segmented-button-group>
```

在 `<mdui-segmented-button>` 元素上，通过添加 `selected-icon` 属性，可以设置选中状态的 Material Icons 图标。也可以通过 `selected-icon` slot 进行设置。

```html,example,expandable
<mdui-segmented-button-group selects="multiple">
  <mdui-segmented-button value="day" selected-icon="cloud_done">Day</mdui-segmented-button>
  <mdui-segmented-button value="week">
    <mdui-icon slot="selected-icon" name="cloud_done"></mdui-icon>
    Week
  </mdui-segmented-button>
</mdui-segmented-button-group>
```

### 链接 {#example-link}

在 `<mdui-segmented-button>` 元素上，通过设置 `href` 属性，可以将按钮转换为链接。此时，还可以使用与链接相关的属性，如：`download`、`target`、`rel`。

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button href="https://www.mdui.org" target="_blank">Link</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

### 禁用及加载中状态 {#example-disabled}

在 `<mdui-segmented-button-group>` 元素上，通过添加 `disabled` 属性，可以禁用整个分段按钮组。

```html,example,expandable
<mdui-segmented-button-group disabled>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button>Week</mdui-segmented-button>
  <mdui-segmented-button>Month</mdui-segmented-button>
</mdui-segmented-button-group>
```

在 `<mdui-segmented-button>` 元素上，通过添加 `disabled` 属性，可以禁用特定按钮；通过添加 `loading` 属性，可以为特定按钮添加加载中状态。

```html,example,expandable
<mdui-segmented-button-group>
  <mdui-segmented-button>Day</mdui-segmented-button>
  <mdui-segmented-button disabled>Week</mdui-segmented-button>
  <mdui-segmented-button loading>Month</mdui-segmented-button>
  <mdui-segmented-button disabled loading>Year</mdui-segmented-button>
</mdui-segmented-button-group>
```

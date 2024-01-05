导航栏用于在移动端页面中方便地在几个主要页面之间进行切换。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/navigation-bar.js';
import 'mdui/components/navigation-bar-item.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { NavigationBar } from 'mdui/components/navigation-bar.js';
import type { NavigationBarItem } from 'mdui/components/navigation-bar-item.js';
```

使用示例：（示例中的 `style="position: relative"` 为演示所需，使用时请移除该样式。）

```html,example
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

**注意事项：**

该组件默认使用 `position: fixed` 定位，且会自动在 `body` 上添加 `padding-bottom` 样式，以避免页面内容被该组件遮挡。但在下列两种情况下，默认使用 `position: absolute` 定位：

1. 指定了 `scroll-target` 属性时。且此时会在 `scroll-target` 的元素上添加 `padding-bottom` 样式。
2. 位于 [`<mdui-layout></mdui-layout>`](/zh-cn/docs/2/components/layout) 组件中时。此时不会添加 `padding-bottom` 样式。

## 示例 {#examples}

### 文本标签显示状态 {#example-label-visibility}

导航栏中的文本标签默认在导航项小于等于 3 个时，始终显示；大于 3 个时，仅显示选中状态的文本。

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>

<br/>

<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="directions_railway" value="item-3">Item 3</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-4">Item 4</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

可在 `<mdui-navigation-bar>` 组件上通过 `label-visibility` 属性设置文本标签的显示状态。可选值为：

* `selected`：仅显示选中状态的文本
* `labeled`：始终显示文本
* `unlabeled`：始终不显示文本

```html,example,expandable
<mdui-navigation-bar value="item-1" label-visibility="selected" style="position: relative" class="example-label">
  <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
</mdui-navigation-bar>

<mdui-segmented-button-group value="selected" selects="single" style="margin-top: 16px">
  <mdui-segmented-button value="selected">selected</mdui-segmented-button>
  <mdui-segmented-button value="labeled">labeled</mdui-segmented-button>
  <mdui-segmented-button value="unlabeled">unlabeled</mdui-segmented-button>
</mdui-segmented-button-group>

<script>
  const navigationBar = document.querySelector(".example-label");
  const segmentedButtonGroup = navigationBar.nextElementSibling;

  segmentedButtonGroup.addEventListener("change", (event) => {
    navigationBar.labelVisibility = event.target.value;
  });
</script>
```

### 位于指定容器内 {#example-scroll-target}

默认情况下，导航栏会相对于当前窗口，显示在页面底部。

如果你希望把导航栏放在指定容器内，可以在 `<mdui-navigation-bar>` 组件上指定 `scroll-target` 属性，其值为可滚动内容的容器的 CSS 选择器或 DOM 元素，此时导航栏会相对于父元素显示（你需要自行在父元素上添加样式 `position: relative; overflow: hidden`）。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-navigation-bar scroll-target=".example-scroll-target" value="item-1">
    <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
  </mdui-navigation-bar>

  <div class="example-scroll-target" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">页面内容</div>
  </div>
</div>
```

### 滚动时隐藏 {#example-scroll-behavior}

在 `<mdui-navigation-bar>` 组件上设置 `scroll-behavior` 属性为 `hide`，可在页面向下滚动时隐藏导航栏，向上滚动时显示导航栏。

使用 `scroll-threshold` 属性，可设置滚动多少像素后开始隐藏导航栏。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-navigation-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior"
    value="item-1"
  >
    <mdui-navigation-bar-item icon="place" value="item-1">Item 1</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
    <mdui-navigation-bar-item icon="people" value="item-3">Item 3</mdui-navigation-bar-item>
  </mdui-navigation-bar>

  <div class="example-scroll-behavior" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">页面内容</div>
  </div>
</div>
```

### 图标 {#example-icon}

在 `<mdui-navigation-bar-item>` 组件上使用 `icon` 属性可设置未激活状态的导航项图标，使用 `active-icon` 属性可设置激活状态的导航项图标。也可以用 `icon` 和 `active-icon` slot 设置未激活和激活状态的图标元素。

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item
    icon="place--outlined"
    active-icon="place"
    value="item-1"
  >Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item value="item-2">
    Item 2
    <mdui-icon slot="icon" name="people--outlined"></mdui-icon>
    <mdui-icon slot="active-icon" name="people"></mdui-icon>
  </mdui-navigation-bar-item>
</mdui-navigation-bar>
```

### 链接 {#example-link}

在 `<mdui-navigation-bar-item>` 组件上设置 `href` 属性，可使导航项变为链接，此时还可使用这些和链接相关的属性：`download`、`target`、`rel`。

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" href="https://www.mdui.org" target="_blank" value="item-1">Item 1</mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

### 徽标 {#example-badge}

在 `<mdui-navigation-bar-item>` 组件中，可通过 `badge` slot 添加徽标。

```html,example,expandable
<mdui-navigation-bar value="item-1" style="position: relative">
  <mdui-navigation-bar-item icon="place" value="item-1">
    Item 1
    <mdui-badge slot="badge">99+</mdui-badge>
  </mdui-navigation-bar-item>
  <mdui-navigation-bar-item icon="commute" value="item-2">Item 2</mdui-navigation-bar-item>
</mdui-navigation-bar>
```

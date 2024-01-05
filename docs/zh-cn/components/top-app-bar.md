顶部应用栏在页面顶部显示信息和相关操作。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/top-app-bar.js';
import 'mdui/components/top-app-bar-title.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { TopAppBar } from 'mdui/components/top-app-bar.js';
import type { TopAppBarTitle } from 'mdui/components/top-app-bar-title.js';
```

使用示例：（示例中的 `style="position: relative"` 为演示所需，使用时请移除该样式。）

```html,example
<mdui-top-app-bar style="position: relative;">
  <mdui-button-icon icon="menu"></mdui-button-icon>
  <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
  <div style="flex-grow: 1"></div>
  <mdui-button-icon icon="more_vert"></mdui-button-icon>
</mdui-top-app-bar>
```

**注意事项：**

该组件默认使用 `position: fixed` 定位，且会自动在 `body` 上添加 `padding-top` 样式，以避免页面内容被该组件遮挡。

但在下列两种情况下，默认使用 `position: absolute` 定位：

1. 指定了 `scroll-target` 属性时。且此时会在 `scroll-target` 的元素上添加 `padding-top` 样式。
2. 位于 [`<mdui-layout></mdui-layout>`](/zh-cn/docs/2/components/layout) 组件中时。此时不会添加 `padding-top` 样式。

## 示例 {#examples}

### 位于指定容器内 {#example-scroll-target}

默认情况下，顶部应用栏会相对于当前窗口，显示在页面顶部。

如果你希望把顶部应用栏放在指定容器内，可以在 `<mdui-top-app-bar>` 组件上指定 `scroll-target` 属性，其值为可滚动内容的容器的 CSS 选择器或 DOM 元素，此时顶部应用栏会相对于父元素显示（你需要自行在父元素上添加样式 `position: relative; overflow: hidden`）。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar scroll-target=".example-scroll-target">
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <div class="example-scroll-target" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### 形状 {#example-variant}

在 `<mdui-top-app-bar>` 组件上使用 `variant` 属性设置顶部应用栏的形状。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar variant="small" scroll-target=".example-variant" class="example-variant-bar">
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-variant" style="height: 160px;overflow: auto;">
    <div style="height: 1000px">
      <mdui-segmented-button-group selects="single" value="small">
        <mdui-segmented-button value="center-aligned">center-aligned</mdui-segmented-button>
        <mdui-segmented-button value="small">small</mdui-segmented-button>
        <mdui-segmented-button value="medium">medium</mdui-segmented-button>
        <mdui-segmented-button value="large">large</mdui-segmented-button>
      </mdui-segmented-button-group>
    </div>
  </div>
</div>

<script>
  const topAppBar = document.querySelector(".example-variant-bar");
  const segmentedButtonGroup = document.querySelector(".example-variant");

  segmentedButtonGroup.addEventListener("change", (event) => {
    topAppBar.variant = event.target.value;
  });
</script>
```

### 滚动时的行为 {#example-scroll-behavior}

在 `<mdui-top-app-bar>` 组件上设置 `scroll-behavior` 属性可设置在页面滚动时，顶部应用栏的行为。可同时使用多个不同的滚动行为，用空格分割即可。

滚动行为包括：

* `hide`：页面向下滚动时隐藏顶部应用栏，向上滚动时显示顶部应用栏。
* `shrink`：在 `variant` 属性为 `medium` 或 `large` 时有效。页面向下滚动时展开顶部应用栏，向上滚动时收缩顶部应用栏。
* `elevate`：页面向下滚动时，在顶部应用栏上添加阴影；页面滚回到顶部时，取消阴影。

使用 `scroll-threshold` 属性，可设置滚动多少像素后开始触发顶部应用栏的滚动行为。（为了响应及时，在使用了 `elevate` 滚动行为时，请不要再设置 `scroll-threshold` 属性）

**示例：滚动时隐藏**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior-hide"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-hide" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**示例：滚动时添加阴影**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    scroll-behavior="elevate"
    scroll-target=".example-scroll-behavior-elevate"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-elevate" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**示例：滚动时收缩**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior-shrink"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-shrink" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

**示例：滚动时收缩及添加阴影**

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink elevate"
    scroll-target=".example-scroll-behavior-shrink-elevate"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-scroll-behavior-shrink-elevate" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### 展开状态的文本 {#label-large}

对于 `variant` 为 `medium` 或 `large`，且 `scroll-behavior` 为 `shrink` 的顶部应用栏，可以在 `<mdui-top-app-bar-title>` 组件中添加 `label-large` slot，设置展开状态的文本。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-top-app-bar
    variant="medium"
    scroll-behavior="shrink elevate"
    scroll-target=".example-label-large-slot"
  >
    <mdui-button-icon icon="menu"></mdui-button-icon>
    <mdui-top-app-bar-title>
      这是收起状态的标题
      <span slot="label-large">这是展开状态的标题</span>
    </mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-button-icon icon="more_vert"></mdui-button-icon>
  </mdui-top-app-bar>

  <div class="example-label-large-slot" style="height: 160px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

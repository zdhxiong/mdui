底部应用栏主要用于在移动端页面底部展示导航项和其他重要操作。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/bottom-app-bar.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { BottomAppBar } from 'mdui/components/bottom-app-bar.js';
```

使用示例：（注意：示例中的 `style="position: relative"` 是为了演示需要，实际使用时请移除该样式。）

```html,example
<mdui-bottom-app-bar style="position: relative;">
  <mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
  <mdui-button-icon icon="edit--outlined"></mdui-button-icon>
  <mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
  <mdui-button-icon icon="image--outlined"></mdui-button-icon>
  <div style="flex-grow: 1"></div>
  <mdui-fab icon="add"></mdui-fab>
</mdui-bottom-app-bar>
```

**注意事项：**

该组件默认使用 `position: fixed` 定位，并会自动在 `body` 上添加 `padding-bottom` 样式，以防止页面内容被该组件遮挡。

但在以下两种情况下，会默认使用 `position: absolute` 定位：

1. 当指定了 `scroll-target` 属性时。此时会在 `scroll-target` 的元素上添加 `padding-bottom` 样式。
2. 当位于 [`<mdui-layout></mdui-layout>`](/zh-cn/docs/2/components/layout) 组件中时。此时不会添加 `padding-bottom` 样式。

## 示例 {#examples}

### 位于指定容器内 {#example-scroll-target}

默认情况下，底部应用栏会相对于当前窗口，在页面底部显示。

如果你希望将底部应用栏放在指定的容器内，可以指定 `scroll-target` 属性，其值为可滚动内容的容器的 CSS 选择器或 DOM 元素。此时，底部应用栏会相对于父元素显示（你需要自行在父元素上添加 `position: relative; overflow: hidden` 样式）。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar scroll-target=".example-scroll-target">Content</mdui-bottom-app-bar>

  <div class="example-scroll-target" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### 滚动时隐藏 {#example-scroll-behavior}

设置 `scroll-behavior` 属性为 `hide`，可以在页面向下滚动时隐藏底部应用栏，向上滚动时显示底部应用栏。

使用 `scroll-threshold` 属性，可以设置滚动多少像素后开始隐藏底部应用栏。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-scroll-behavior"
  >Content</mdui-bottom-app-bar>

  <div class="example-scroll-behavior" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

### 固定浮动操作按钮 {#example-fab-detach}

如果底部应用栏中包含了[浮动操作按钮](/zh-cn/docs/2/components/fab)，则可以添加 `fab-detach` 属性，使得在页面滚动，底部应用栏隐藏时，浮动操作按钮仍然停留在页面右下角。

```html,example,expandable
<div style="position: relative;overflow: hidden">
  <mdui-bottom-app-bar
    fab-detach
    scroll-behavior="hide"
    scroll-threshold="30"
    scroll-target=".example-fab-detach"
  >
    <mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
    <mdui-button-icon icon="edit--outlined"></mdui-button-icon>
    <mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
    <mdui-button-icon icon="image--outlined"></mdui-button-icon>
    <div style="flex-grow: 1"></div>
    <mdui-fab icon="add"></mdui-fab>
  </mdui-bottom-app-bar>

  <div class="example-fab-detach" style="height: 200px;overflow: auto;">
    <div style="height: 1000px"></div>
  </div>
</div>
```

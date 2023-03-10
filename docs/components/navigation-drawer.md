侧边抽屉栏用于在页面侧边提供访问不同页面的方式。通常可在侧边抽屉栏中使用 [`<mdui-list>`](/docs/2/components/list) 组件来添加侧边导航项。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/navigation-drawer.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { NavigationDrawer } from 'mdui/components/navigation-drawer.js';
```

使用示例：

```html,example
<mdui-navigation-drawer close-on-overlay-click class="example-drawer">
  <mdui-button>关闭侧边抽屉栏</mdui-button>
</mdui-navigation-drawer>

<mdui-button>打开侧边抽屉栏</mdui-button>

<script>
  const navigationDrawer = document.querySelector(".example-drawer");
  const openButton = navigationDrawer.nextElementSibling;
  const closeButton = navigationDrawer.querySelector("mdui-button");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

**注意事项：**

该组件默认使用 `position: fixed` 定位。

在 `modal` 属性为 `false`，且断点大于等于 [`--mdui-breakpoint-md`](/docs/2/styles/design-tokens#breakpoint) 时，会自动在 `body` 上添加 `padding-left` 或 `padding-right` 样式，以避免页面内容被该组件遮挡。

但在下列两种情况下，默认使用 `position: absolute` 定位：

1. `contained` 属性为 `true` 时。
2. 位于 [`<mdui-layout></mdui-layout>`](/docs/2/components/layout) 组件中时。此时不会添加 `padding-left` 或 `padding-right` 样式。

## 示例 {#examples}

### 位于指定容器内 {#example-contained}

默认情况下，侧边抽屉栏会相对于当前窗口，显示在页面左侧或右侧。

如果你希望把侧边抽屉栏放在指定容器内，可以添加 `contained` 属性，此时侧边抽屉栏会相对于父元素显示（你需要自行在父元素上添加样式 `position: relative; overflow: hidden;`）。

```html,example,expandable
<div class="example-contained" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer contained>
    <mdui-button class="close">关闭侧边抽屉栏</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">打开侧边抽屉栏</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-contained");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

### 模态化 {#example-modal}

添加 `modal` 属性可在打开侧边抽屉栏时显示遮罩层。注意在窗口或父元素宽度小于 [`--mdui-breakpoint-md`](/docs/2/styles/design-tokens#breakpoint) 时，会无视该参数，始终会显示遮罩层。

添加 `close-on-esc` 属性，可在按下 ESC 键时关闭侧边抽屉栏。

添加 `close-on-overlay-click` 属性，可在点击遮罩层时关闭侧边抽屉栏。

```html,example,expandable
<div class="example-modal" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer modal close-on-esc close-on-overlay-click contained>
    <mdui-button class="close">关闭侧边抽屉栏</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">打开侧边抽屉栏</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-modal");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

### 位于右侧 {#example-placement}

设置 `placement` 属性为 `right`，可将侧边抽屉栏显示在右侧。

```html,example,expandable
<div class="example-placement" style="position: relative; overflow: hidden">
  <mdui-navigation-drawer placement="right" modal close-on-esc close-on-overlay-click contained>
    <mdui-button class="close">关闭侧边抽屉栏</mdui-button>
  </mdui-navigation-drawer>

  <div style="height: 160px;">
    <mdui-button class="open">打开侧边抽屉栏</mdui-button>
  </div>
</div>

<script>
  const example = document.querySelector(".example-placement");
  const navigationDrawer = example.querySelector("mdui-navigation-drawer");
  const openButton = example.querySelector(".open");
  const closeButton = example.querySelector(".close");

  openButton.addEventListener("click", () => navigationDrawer.open = true);
  closeButton.addEventListener("click", () => navigationDrawer.open = false);
</script>
```

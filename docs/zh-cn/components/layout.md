布局组件用于辅助页面级别的整体布局。

<style>
.example-top-app-bar {
  background-color: rgb(var(--mdui-color-surface-container));
}

.example-navigation-drawer::part(panel) {
  background-color: rgb(var(--mdui-color-surface-container-low));
}

.example-layout-item {
  background-color: rgb(var(--mdui-color-surface-container-low));
}

.example-layout-main {
  background-color: rgb(var(--mdui-color-surface-container-lowest));
}

@media (min-width: 840px) {
  .example-md-visible {
    display: none;
  }
}
</style>

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/layout.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Layout } from 'mdui/components/layout.js';
import type { LayoutItem } from 'mdui/components/layout-item.js';
import type { LayoutMain } from 'mdui/components/layout-main.js';
```

**介绍：**

布局系统遵循从外向内的原则构建，每个布局组件（`<mdui-layout-item>` 组件）都会在四个方向（上、下、左、右）之一的位置占据空间，随后的布局组件会在剩余空间中继续占据空间。

以下组件直接继承自 `<mdui-layout-item>` 组件，因此也可以作为布局组件使用：

* [`<mdui-navigation-bar>`](/zh-cn/docs/2/components/navigation-bar)
* [`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer)
* [`<mdui-navigation-rail>`](/zh-cn/docs/2/components/navigation-rail)
* [`<mdui-bottom-app-bar>`](/zh-cn/docs/2/components/bottom-app-bar)
* [`<mdui-top-app-bar>`](/zh-cn/docs/2/components/top-app-bar)

布局系统的最后一部分是 `<mdui-layout-main>` 组件，它会占据剩余空间，你可以在该组件内放置页面内容。

## 示例 {#examples}

### 布局组件顺序 {#layout-default-order}

默认情况下，布局组件会按照在代码中出现的顺序来占据空间。你可以从下面两个示例来理解这个概念，这两个示例中，[`<mdui-top-app-bar>`](/zh-cn/docs/2/components/top-app-bar) 和 [`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer) 在代码中出现的顺序不同。

<p class="example-md-visible">请在大屏显示器上查看该示例。</p>

```html,example,expandable
<mdui-layout>
  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-navigation-drawer open class="example-navigation-drawer">
    <mdui-list>
      <mdui-list-item>Navigation drawer</mdui-list-item>
    </mdui-list>
  </mdui-navigation-drawer>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

```html,example,expandable
<mdui-layout>
  <mdui-navigation-drawer open class="example-navigation-drawer">
    <mdui-list>
      <mdui-list-item>Navigation drawer</mdui-list-item>
    </mdui-list>
  </mdui-navigation-drawer>

  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

可以发现，将 [`<mdui-top-app-bar>`](/zh-cn/docs/2/components/top-app-bar) 放在 [`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer) 之前时，[`<mdui-top-app-bar>`](/zh-cn/docs/2/components/top-app-bar) 会率先占满屏幕的宽度，而 [`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer) 只能在剩余的空间内占满高度。调换二者顺序后，[`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer) 会率先占满屏幕的高度，而 [`<mdui-top-app-bar>`](/zh-cn/docs/2/components/top-app-bar) 只能在剩余的空间内占满宽度。

### 布局组件位置 {#example-placement}

对于 `<mdui-layout-item>` 组件，你可以使用 `placement` 属性来指定其在布局中的上、下、左、右位置。 对于 [`<mdui-navigation-drawer>`](/zh-cn/docs/2/components/navigation-drawer) 和 [`<mdui-navigation-rail>`](/zh-cn/docs/2/components/navigation-rail) 组件，你也可以使用 `placement` 属性来指定其在布局中的左、右位置。

下面的示例中，我们将两个 `<mdui-layout-item>` 组件放在了应用的两侧。

```html,example,expandable
<mdui-layout>
  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
  </mdui-top-app-bar>

  <mdui-layout-item
    placement="left"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-layout-item
    placement="right"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>
```

### 自定义布局组件顺序 {#example-order}

在大多数情况下，只要按顺序放置布局组件就能实现你想要的布局。

你也可以使用 `order` 属性来指定布局顺序，系统将按 `order` 的值从小到大排列组件，`order` 相同时则按代码顺序排列。所有布局组件的默认 `order` 都为 `0`。

```html,example,expandable
<mdui-layout class="example-order">
  <mdui-layout-item
    placement="left"
    class="example-layout-item"
    style="width: 100px"
  >Layout Item</mdui-layout-item>

  <mdui-top-app-bar class="example-top-app-bar">
    <mdui-top-app-bar-title>Top App Bar</mdui-top-app-bar-title>
    <div style="flex-grow: 1"></div>
    <mdui-checkbox>order="-1"</mdui-checkbox>
  </mdui-top-app-bar>

  <mdui-layout-main class="example-layout-main" style="min-height: 300px">Main</mdui-layout-main>
</mdui-layout>

<script>
  const topAppBar = document.querySelector(".example-order mdui-top-app-bar");
  const checkbox = document.querySelector(".example-order mdui-checkbox");

  checkbox.addEventListener("change", (event) => {
    topAppBar.order = event.target.checked ? -1 : 0;
  });
</script>
```

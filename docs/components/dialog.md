对话框用于在用户的操作流程中提供重要提示。

除了直接使用该组件外，mdui 还提供了四个函数：[`mdui.dialog`](/docs/2/functions/dialog)、[`mdui.alert`](/docs/2/functions/alert)、[`mdui.confirm`](/docs/2/functions/confirm)、[`mdui.prompt`](/docs/2/functions/prompt)。这些函数可以简化 Dialog 组件的使用。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/dialog.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Dialog } from 'mdui/components/dialog.js';
```

使用示例：

```html,example
<mdui-dialog class="example-dialog">
  Dialog
  <mdui-button>关闭</mdui-button>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-dialog");
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector("mdui-button");

  openButton.addEventListener("click", () => dialog.open = true);
  closeButton.addEventListener("click", () => dialog.open = false);
</script>
```

## 示例 {#examples}

### 点击遮罩关闭 {#example-close-on-overlay-click}

添加 `close-on-overlay-click` 属性可在点击遮罩层时关闭对话框。

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-overlay">Dialog</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-overlay");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### 按下 ESC 键关闭 {#example-close-on-esc}

添加 `close-on-esc` 属性可支持在按下 ESC 键时关闭对话框。

```html,example,expandable
<mdui-dialog
  close-on-esc
  close-on-overlay-click
  class="example-ecs"
>Dialog</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-ecs");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### 全屏 {#example-fullscreen}

添加 `fullscreen` 属性可使对话框全屏显示。

```html,example,expandable
<mdui-dialog fullscreen class="example-fullscreen">
  Dialog
  <mdui-button>关闭</mdui-button>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-fullscreen");
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector("mdui-button");

  openButton.addEventListener("click", () => dialog.open = true);
  closeButton.addEventListener("click", () => dialog.open = false);
</script>
```

### 图标 {#example-icon}

设置 `icon` 属性，可在对话框上方添加 Material Icons 图标。

```html,example,expandable
<mdui-dialog
  icon="restart_alt"
  close-on-overlay-click
  class="example-icon"
>Dialog</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-icon");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

也可以通过 `icon` slot 在对话框上方添加图标元素。

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-icon-slot">
  Dialog
  <mdui-icon slot="icon" name="restart_alt"></mdui-icon>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-icon-slot");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### 标题与描述 {#example-headline}

可通过 `headline` 和 `description` 属性设置对话框的标题和描述。

```html,example,expandable
<mdui-dialog
  headline="Delete selected images?"
  description="Images will be permenantly removed from you account and all synced devices."
  close-on-overlay-click
  class="example-headline"
></mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-headline");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

也可以通过 `headline` 和 `description` slot 设置对话框的标题元素和描述元素。

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-headline-slot">
  <span slot="headline">Delete selected images?</span>
  <span slot="description">Images will be permenantly removed from you account and all synced devices.</span>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-headline-slot");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### 底部操作按钮 {#example-action}

可通过 `action` slot 添加底部操作按钮。

```html,example,expandable
<mdui-dialog
  close-on-overlay-click
  headline="Delete selected images?"
  class="example-action"
>
  <mdui-button slot="action" variant="text">取消</mdui-button>
  <mdui-button slot="action" variant="tonal">删除</mdui-button>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-action");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

添加 `stacked-actions` 属性使底部操作按钮垂直排列。

```html,example,expandable
<mdui-dialog
  stacked-actions
  close-on-overlay-click
  headline="Use location service?"
  class="example-stacked-actions"
>
  <mdui-button slot="action" variant="text">Turn on speed boost</mdui-button>
  <mdui-button slot="action" variant="text">No thanks</mdui-button>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-stacked-actions");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### 顶部内容 {#example-header}

可通过 `header` slot 设置对话框顶部内容。

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-header">
  <mdui-top-app-bar slot="header">
    <mdui-button-icon icon="close"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <mdui-button variant="text">Save</mdui-button>
  </mdui-top-app-bar>
  <div style="height: 100px"></div>
</mdui-dialog>

<mdui-button>打开对话框</mdui-button>

<script>
  const dialog = document.querySelector(".example-header");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

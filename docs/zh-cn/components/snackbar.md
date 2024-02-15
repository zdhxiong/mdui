消息条组件用于在页面中展示简短的应用程序进程信息。

除了直接使用该组件外，mdui 还提供了一个 [`mdui.snackbar`](/zh-cn/docs/2/functions/snackbar) 函数，以简化 Snackbar 组件的使用。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/snackbar.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { Snackbar } from 'mdui/components/snackbar.js';
```

使用示例：

```html,example
<mdui-snackbar class="example-snackbar">Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-snackbar");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

## 示例 {#examples}

### 位置 {#example-placement}

通过 `placement` 属性，你可以设置 Snackbar 的显示位置。

```html,example,expandable
<div class="example-placement">
  <div class="row">
    <mdui-snackbar placement="top-start">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">top-start</mdui-button>

    <mdui-snackbar placement="top">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">top</mdui-button>

    <mdui-snackbar placement="top-end">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">top-end</mdui-button>
  </div>
  <div class="row">
    <mdui-snackbar placement="bottom-start">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">bottom-start</mdui-button>

    <mdui-snackbar placement="bottom">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">bottom</mdui-button>

    <mdui-snackbar placement="bottom-end">Photo archived</mdui-snackbar>
    <mdui-button variant="outlined">bottom-end</mdui-button>
  </div>
</div>

<script>
  const snackbars = document.querySelectorAll(".example-placement mdui-snackbar");

  snackbars.forEach((snackbar) => {
    const button = snackbar.nextElementSibling;
    button.addEventListener("click", () => snackbar.open = true);
  });
</script>

<style>
.example-placement mdui-button {
  margin: 0.25rem;
  width: 7.5rem;
}
</style>
```

### 操作按钮 {#example-action}

可以使用 `action` 属性在 Snackbar 的右侧添加一个操作按钮，并通过该属性指定按钮的文本。点击操作按钮会触发 `action-click` 事件。如果你想让操作按钮显示为加载中状态，可以添加 `action-loading` 属性。

```html,example,expandable
<mdui-snackbar action="Undo" class="example-action">Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-action");
  const openButton = snackbar.nextElementSibling;

  snackbar.addEventListener("action-click", () => {
    snackbar.actionLoading = true;
    setTimeout(() => snackbar.actionLoading = false, 2000);
  });

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

也可以通过 `action` slot 在 Snackbar 的右侧添加自定义元素。

```html,example,expandable
<mdui-snackbar class="example-action-slot">
  Photo archived
  <mdui-button slot="action" variant="text">Undo</mdui-button>
</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-action-slot");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### 可关闭 {#example-closeable}

添加 `closeable` 属性后，Snackbar 的右侧会出现一个关闭按钮。点击该按钮会关闭 Snackbar，并触发 `close` 事件。

```html,example,expandable
<mdui-snackbar closeable class="example-closeable">Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-closeable");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

可以通过 `close-button` slot 来自定义关闭按钮的元素。

```html,example,expandable
<mdui-snackbar closeable class="example-close-button-slot">
  Photo archived
  <mdui-avatar slot="close-button" icon="people_alt"></mdui-avatar>
</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-button-slot");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

通过设置 `close-icon` 属性，你可以修改默认关闭按钮中的 Material Icons 图标。也可以通过 `close-icon` slot 来自定义关闭按钮中的图标元素。

```html,example,expandable
<mdui-snackbar
  closeable
  close-icon="delete"
  class="example-close-icon"
>Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-icon");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### 文本行数 {#example-message-line}

默认情况下，消息文本没有行数限制。你可以通过 `message-line` 属性来限制文本行数，最多可以设置为 2 行。

```html,example,expandable
<mdui-snackbar message-line="1" class="example-line">The item already has the label "travel". You can add a new label. You can add a new label.</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-line");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### 自动关闭延时 {#example-auto-close-delay}

可以使用 `auto-close-delay` 属性来设置自动关闭的延时，单位为毫秒。默认值为 5000 毫秒。

```html,example,expandable
<mdui-snackbar auto-close-delay="2000" class="example-close-delay">Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-delay");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### 点击外部区域关闭 {#example-close-on-outside-click}

通过添加 `close-on-outside-click` 属性，你可以设置在点击 Snackbar 外部区域时关闭 Snackbar。

```html,example,expandable
<mdui-snackbar close-on-outside-click class="example-outside">Photo archived</mdui-snackbar>

<mdui-button>打开 Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-outside");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

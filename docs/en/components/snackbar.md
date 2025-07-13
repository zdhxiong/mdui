Snackbars provide brief updates about app processes at the bottom of the screen.

In addition to direct component usage, mdui also offers a [`mdui.snackbar`](/en/docs/2/functions/snackbar) function for simplified Snackbar component usage.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/snackbar.js';
```

Import the TypeScript type:

```ts
import type { Snackbar } from 'mdui/components/snackbar.js';
```

Example:

```html,example,playgroundId=375
<mdui-snackbar class="example-snackbar">Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-snackbar");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

## Examples {#examples}

### Position {#example-placement}

You can set the snackbar's position using the `placement` attribute.

```html,example,expandable,playgroundId=376
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

### Action Button {#example-action}

The `action` attribute adds an action button on the right side and specifies its text. The `action-click` event is triggered when the action button is clicked. The `action-loading` attribute displays a loading state on the action button.

```html,example,expandable,playgroundId=377
<mdui-snackbar action="Undo" class="example-action">Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

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

The `action` slot can also be used to add elements on the right side.

```html,example,expandable,playgroundId=378
<mdui-snackbar class="example-action-slot">
  Photo archived
  <mdui-button slot="action" variant="text">Undo</mdui-button>
</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-action-slot");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### Closeable {#example-closeable}

The `closeable` attribute adds a close button on the right. Clicking the button closes the snackbar and triggers the `close` event.

```html,example,expandable,playgroundId=379
<mdui-snackbar closeable class="example-closeable">Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-closeable");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

The `close-button` slot specifies the element of the close button.

```html,example,expandable,playgroundId=380
<mdui-snackbar closeable class="example-close-button-slot">
  Photo archived
  <mdui-avatar slot="close-button" icon="people_alt"></mdui-avatar>
</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-button-slot");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

The `close-icon` attribute sets the Material Icon in the default close button. The `close-icon` slot sets the icon element in the default close button.

```html,example,expandable,playgroundId=381
<mdui-snackbar
  closeable
  close-icon="delete"
  class="example-close-icon"
>Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-icon");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### Text Lines {#example-message-line}

The `message-line` attribute limits the number of lines in the message text, with a maximum of `2` lines.

```html,example,expandable,playgroundId=382
<mdui-snackbar message-line="1" class="example-line">The item already has the label "travel". You can add a new label. You can add a new label.</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-line");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### Auto Close Delay {#example-auto-close-delay}

The `auto-close-delay` attribute sets the delay for automatic closure, in milliseconds. The default is `5000` milliseconds.

```html,example,expandable,playgroundId=383
<mdui-snackbar auto-close-delay="2000" class="example-close-delay">Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-close-delay");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

### Closing on Outside Click {#example-close-on-outside-click}

The `close-on-outside-click` attribute closes the snackbar when clicking outside of its area.

```html,example,expandable,playgroundId=384
<mdui-snackbar close-on-outside-click class="example-outside">Photo archived</mdui-snackbar>

<mdui-button>Open Snackbar</mdui-button>

<script>
  const snackbar = document.querySelector(".example-outside");
  const openButton = snackbar.nextElementSibling;

  openButton.addEventListener("click", () => snackbar.open = true);
</script>
```

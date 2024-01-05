Dialogs are used to display crucial information during a user's workflow.

In addition to directly using this component, mdui also provides four functions: [`mdui.dialog`](/en/docs/2/functions/dialog), [`mdui.alert`](/en/docs/2/functions/alert), [`mdui.confirm`](/en/docs/2/functions/confirm), [`mdui.prompt`](/en/docs/2/functions/prompt). These functions simplify the use of the Dialog component.

## Usage {#usage}

Import the component:

```js
import 'mdui/components/dialog.js';
```

Import the TypeScript type:

```ts
import type { Dialog } from 'mdui/components/dialog.js';
```

Example:

```html,example
<mdui-dialog class="example-dialog">
  Dialog
  <mdui-button>Close</mdui-button>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-dialog");
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector("mdui-button");

  openButton.addEventListener("click", () => dialog.open = true);
  closeButton.addEventListener("click", () => dialog.open = false);
</script>
```

## Examples {#examples}

### Close on Overlay Click {#example-close-on-overlay-click}

Add the `close-on-overlay-click` attribute to close the dialog when the overlay is clicked.

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-overlay">Dialog</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-overlay");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### Close on ESC {#example-close-on-esc}

Add the `close-on-esc` attribute to enable closing the dialog when the ESC key is pressed.

```html,example,expandable
<mdui-dialog
  close-on-esc
  close-on-overlay-click
  class="example-ecs"
>Dialog</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-ecs");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### Fullscreen {#example-fullscreen}

Add the `fullscreen` attribute to make the dialog fullscreen.

```html,example,expandable
<mdui-dialog fullscreen class="example-fullscreen">
  Dialog
  <mdui-button>Close</mdui-button>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-fullscreen");
  const openButton = dialog.nextElementSibling;
  const closeButton = dialog.querySelector("mdui-button");

  openButton.addEventListener("click", () => dialog.open = true);
  closeButton.addEventListener("click", () => dialog.open = false);
</script>
```

### Icon {#example-icon}

Set the `icon` attribute to add a Material Icon above the dialog.

```html,example,expandable
<mdui-dialog
  icon="restart_alt"
  close-on-overlay-click
  class="example-icon"
>Dialog</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-icon");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

Alternatively, add an icon element above the dialog using the `icon` slot.

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-icon-slot">
  Dialog
  <mdui-icon slot="icon" name="restart_alt"></mdui-icon>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-icon-slot");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### Title and Description {#example-headline}

Use the `headline` and `description` attributes to set the dialog's title and description.

```html,example,expandable
<mdui-dialog
  headline="Delete selected images?"
  description="Images will be permenantly removed from you account and all synced devices."
  close-on-overlay-click
  class="example-headline"
></mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-headline");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

Alternatively, use the `headline` and `description` slots to set the title and description elements.

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-headline-slot">
  <span slot="headline">Delete selected images?</span>
  <span slot="description">Images will be permenantly removed from you account and all synced devices.</span>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-headline-slot");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### Action Buttons at the Bottom {#example-action}

Use the `action` slot to add action buttons at the bottom of the dialog.

```html,example,expandable
<mdui-dialog
  close-on-overlay-click
  headline="Delete selected images?"
  class="example-action"
>
  <mdui-button slot="action" variant="text">Cancel</mdui-button>
  <mdui-button slot="action" variant="tonal">Delete</mdui-button>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-action");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

Add the `stacked-actions` attribute to stack the action buttons vertically.

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

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-stacked-actions");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

### Top Content {#example-header}

Use the `header` slot to set the top content of the dialog.

```html,example,expandable
<mdui-dialog close-on-overlay-click class="example-header">
  <mdui-top-app-bar slot="header">
    <mdui-button-icon icon="close"></mdui-button-icon>
    <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
    <mdui-button variant="text">Save</mdui-button>
  </mdui-top-app-bar>
  <div style="height: 100px"></div>
</mdui-dialog>

<mdui-button>Open Dialog</mdui-button>

<script>
  const dialog = document.querySelector(".example-header");
  const openButton = dialog.nextElementSibling;

  openButton.addEventListener("click", () => dialog.open = true);
</script>
```

The `alert` function, a wrapper for the [`<mdui-dialog>`](/en/docs/2/components/dialog) component, supersedes the native `window.alert` function, enabling the creation of alert dialogs without HTML code.

## Usage {#usage}

Import the function:

```js
import { alert } from 'mdui/functions/alert.js';
```

Example:

```html,example
<mdui-button class="example-button">open</mdui-button>

<script type="module">
  import { alert } from "mdui/functions/alert.js";

  const button = document.querySelector(".example-button");

  button.addEventListener("click", () => {
    alert({
      headline: "Alert Title",
      description: "Alert description",
      confirmText: "OK",
      onConfirm: () => console.log("confirmed"),
    });
  });
</script>
```

## API {#api}

<pre><code class="nohighlight">alert(options: <a href="#api-options">Options</a>): Promise&lt;void&gt;</code></pre>

The `alert` function takes an [Options](#api-options) object and returns a Promise. The Promise resolves if the dialog is closed by clicking the confirm button, and rejects if closed by other means.

### Options {#api-options}

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr id="options-headline">
      <td><a href="#options-headline"><code>headline</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The title of the dialog.</td>
    </tr>
    <tr id="options-description">
      <td><a href="#options-description"><code>description</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The description of the dialog.</td>
    </tr>
    <tr id="options-icon">
      <td><a href="#options-icon"><code>icon</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The Material Icons name displayed at the top of the dialog.</td>
    </tr>
    <tr id="options-closeOnEsc">
      <td><a href="#options-closeOnEsc"><code>closeOnEsc</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether the dialog can be closed by pressing the Esc key. If set to <code>true</code>, the dialog closes when the Esc key is pressed.</td>
    </tr>
    <tr id="options-closeOnOverlayClick">
      <td><a href="#options-closeOnOverlayClick"><code>closeOnOverlayClick</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether the dialog can be closed by clicking on the overlay.</td>
    </tr>
    <tr id="options-confirmText">
      <td><a href="#options-confirmText"><code>confirmText</code></a></td>
      <td><code>string</code></td>
      <td><code>OK</code></td>
    </tr>
    <tr>
      <td colspan="3">The text for the confirm button.</td>
    </tr>
    <tr id="options-queue">
      <td><a href="#options-queue"><code>queue</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>The queue name.</p>
        <p>By default, the queue is disabled. If this function is invoked multiple times, multiple dialogs will appear simultaneously.</p>
        <p>If a queue name is provided, dialogs with the same queue name will open sequentially, each one after the previous one closes.</p>
        <p>The <a href="/en/docs/2/functions/dialog"><code>dialog()</code></a>, <code>alert()</code>, <a href="/en/docs/2/functions/confirm"><code>confirm()</code></a>, and <a href="/en/docs/2/functions/prompt"><code>prompt()</code></a> functions share the same queue if their queue names match.</p>
      </td>
    </tr>
    <tr id="options-onConfirm">
      <td><a href="#options-onConfirm"><code>onConfirm</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void | boolean | Promise&lt;void&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the confirm button is clicked. </p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
        <p>By default, clicking the confirm button closes the dialog. If the return value is <code>false</code>, the dialog remains open. If the return value is a promise, the dialog closes after the promise resolves.</p>
      </td>
    </tr>
    <tr id="options-onOpen">
      <td><a href="#options-onOpen"><code>onOpen</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the dialog starts to open.</p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
      </td>
    </tr>
    <tr id="options-onOpened">
      <td><a href="#options-onOpened"><code>onOpened</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the dialog's opening animation completes.</p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
      </td>
    </tr>
    <tr id="options-onClose">
      <td><a href="#options-onClose"><code>onClose</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the dialog starts to close.</p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
      </td>
    </tr>
    <tr id="options-onClosed">
      <td><a href="#options-onClosed"><code>onClosed</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the dialog's closing animation completes.</p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
      </td>
    </tr>
    <tr id="options-onOverlayClick">
      <td><a href="#options-onOverlayClick"><code>onOverlayClick</code></a></td>
      <td><code>(dialog: <a href="/en/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>A callback function that is triggered when the overlay is clicked.</p>
        <p>The function receives the dialog instance as a parameter, and <code>this</code> also refers to the dialog instance.</p>
      </td>
    </tr>
  </tbody>
</table>

The `snackbar` function provides a simple method to utilize the [`<mdui-snackbar>`](/en/docs/2/components/snackbar) component without the need to write HTML code.

## Usage {#usage}

Import the function:

```js
import { snackbar } from 'mdui/functions/snackbar.js';
```

Example:

```html,example
<mdui-button class="example-button">open</mdui-button>

<script type="module">
  import { snackbar } from "mdui/functions/snackbar.js";

  const button = document.querySelector(".example-button");

  button.addEventListener("click", () => {
    snackbar({
      message: "Photo archived",
      action: "Undo",
      onActionClick: () => console.log("click action button")
    });
  });
</script>
```

## API {#api}

<pre><code class="nohighlight">snackbar(options: <a href="#api-options">Options</a>): <a href="/en/docs/2/components/snackbar">Snackbar</a></code></pre>

The snackbar function accepts an [Options](#api-options) object as its parameter and returns an instance of the [`<mdui-snackbar>`](/en/docs/2/components/snackbar) component.

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
    <tr id="options-message">
      <td><a href="#options-message"><code>message</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The text to display in the snackbar.</td>
    </tr>
    <tr id="options-placement">
      <td><a href="#options-placement"><code>placement</code></a></td>
      <td><code>'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'</code></td>
      <td><code>bottom</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>The position of the snackbar. The default is <code>bottom</code>. Options include:</p>
        <ul>
          <li><code>top</code>: Top, center-aligned.</li>
          <li><code>top-start</code>: Top, left-aligned.</li>
          <li><code>top-end</code>: Top, right-aligned.</li>
          <li><code>bottom</code>: Bottom, center-aligned.</li>
          <li><code>bottom-start</code>: Bottom, left-aligned.</li>
          <li><code>bottom-end</code>: Bottom, right-aligned.</li>
        </ul>
      </td>
    </tr>
    <tr id="options-action">
      <td><a href="#options-action"><code>action</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The text for the action button.</td>
    </tr>
    <tr id="options-closeable">
      <td><a href="#options-closeable"><code>closeable</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether a close button is displayed on the right side.</td>
    </tr>
    <tr id="options-messageLine">
      <td><a href="#options-messageLine"><code>messageLine</code></a></td>
      <td><code>1 | 2</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Sets the maximum number of lines for the message text. The default is unlimited. Options include:</p>
        <ul>
          <li><code>1</code>: Single line.</li>
          <li><code>2</code>: Two lines.</li>
        </ul>
      </td>
    </tr>
    <tr id="options-autoCloseDelay">
      <td><a href="#options-autoCloseDelay"><code>autoCloseDelay</code></a></td>
      <td><code>number</code></td>
      <td><code>5000</code></td>
    </tr>
    <tr>
      <td colspan="3">The delay in milliseconds before the snackbar automatically closes. Set to <code>0</code> to disable auto-close. The default is <code>5000</code> milliseconds (5 seconds).</td>
    </tr>
    <tr id="options-closeOnOutsideClick">
      <td><a href="#options-closeOnOutsideClick"><code>closeOnOutsideClick</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether the snackbar should close on outside clicks or touches.</td>
    </tr>
    <tr id="options-queue">
      <td><a href="#options-queue"><code>queue</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>The queue name.</p>
        <p>By default, the queue is not enabled. If this function is called multiple times, multiple snackbars will be displayed simultaneously.</p>
        <p>If a queue name is provided, snackbars with the same queue name will open sequentially, each after the previous one closes.</p>
      </td>
    </tr>
    <tr id="options-onClick">
      <td><a href="#options-onClick"><code>onClick</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the snackbar is clicked.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
      </td>
    </tr>
    <tr id="options-onActionClick">
      <td><a href="#options-onActionClick"><code>onActionClick</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void | boolean | Promise&lt;void&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the action button is clicked.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
        <p>By default, the snackbar closes when the action button is clicked. Return <code>false</code> to prevent this. If a promise is returned, the snackbar closes once the promise resolves.</p>
      </td>
    </tr>
    <tr id="options-onOpen">
      <td><a href="#options-onOpen"><code>onOpen</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the snackbar starts to open.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
      </td>
    </tr>
    <tr id="options-onOpened">
      <td><a href="#options-onOpened"><code>onOpened</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the snackbar opening animation completes.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
      </td>
    </tr>
    <tr id="options-onClose">
      <td><a href="options-onClose"><code>onClose</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the snackbar starts to close.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
      </td>
    </tr>
    <tr id="options-onClosed">
      <td><a href="#options-onClosed"><code>onClosed</code></a></td>
      <td><code>(snackbar: <a href="/en/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Callback invoked when the snackbar closing animation completes.</p>
        <p>The snackbar instance is passed as a parameter and is also the context of <code>this</code>.</p>
      </td>
    </tr>
  </tbody>
</table>

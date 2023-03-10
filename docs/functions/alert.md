`alert` 函数是对 [`<mdui-dialog>`](/docs/2/components/dialog) 组件的封装，该函数在功能上用于代替系统原生的 `window.alert` 函数。使用该函数，你无需编写组件的 HTML 代码，就能打开一个警告框。

## 使用方法 {#usage}

按需导入函数：

```js
import { alert } from 'mdui/functions/alert.js';
```

使用示例：

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

函数的参数为 [Options](#api-options) 对象；返回值为 Promise，如果是通过点击确定按钮关闭，则 Promise 会被 resolve，如果是通过其他方式关闭，则 Promise 会被 reject。

### Options {#api-options}

<table>
  <thead>
    <tr>
      <th>属性名</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr id="options-headline">
      <td><a href="#options-headline"><code>headline</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">alert 的标题</td>
    </tr>
    <tr id="options-description">
      <td><a href="#options-description"><code>description</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">alert 的描述文本</td>
    </tr>
    <tr id="options-icon">
      <td><a href="#options-icon"><code>icon</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">alert 顶部的 Material Icons 图标名</td>
    </tr>
    <tr id="options-closeOnEsc">
      <td><a href="#options-closeOnEsc"><code>closeOnEsc</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否在按下 ESC 键时，关闭 alert</td>
    </tr>
    <tr id="options-closeOnOverlayClick">
      <td><a href="#options-closeOnOverlayClick"><code>closeOnOverlayClick</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否在点击遮罩层时，关闭 alert</td>
    </tr>
    <tr id="options-confirmText">
      <td><a href="#options-confirmText"><code>confirmText</code></a></td>
      <td><code>string</code></td>
      <td><code>确定</code></td>
    </tr>
    <tr>
      <td colspan="3">确认按钮的文本</td>
    </tr>
    <tr id="options-queue">
      <td><a href="#options-queue"><code>queue</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>队列名称。</p>
        <p>默认不启用队列，在多次调用该函数时，将同时显示多个 alert。</p>
        <p>可在该参数中传入一个队列名称，具有相同队列名称的 alert 函数，将在上一个 alert 关闭后才打开下一个 alert。</p>
        <p><a href="/docs/2/functions/dialog"><code>dialog()</code></a>、<code>alert()</code>、<a href="/docs/2/functions/confirm"><code>confirm()</code></a>、<a href="/docs/2/functions/prompt"><code>prompt()</code></a> 这四个函数的队列名称若相同，则也将互相共用同一个队列。</p>
      </td>
    </tr>
    <tr id="options-onConfirm">
      <td><a href="#options-onConfirm"><code>onConfirm</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void | boolean | Promise&lt;void&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>点击确认按钮时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
        <p>默认点击确认按钮后会关闭 alert；若返回值为 <code>false</code>，则不关闭 alert；若返回值为 promise，则将在 promise 被 resolve 后，关闭 alert。</p>
      </td>
    </tr>
    <tr id="options-onOpen">
      <td><a href="#options-onOpen"><code>onOpen</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>alert 开始打开时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onOpened">
      <td><a href="#options-onOpened"><code>onOpened</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>alert 打开动画完成时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onClose">
      <td><a href="#options-onClose"><code>onClose</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>alert 开始关闭时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onClosed">
      <td><a href="#options-onClosed"><code>onClosed</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>alert 关闭动画完成时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onOverlayClick">
      <td><a href="#options-onOverlayClick"><code>onOverlayClick</code></a></td>
      <td><code>(dialog: <a href="/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>点击遮罩层时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
  </tbody>
</table>

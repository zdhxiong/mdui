`dialog` 函数是对 [`<mdui-dialog>`](/zh-cn/docs/2/components/dialog) 组件的封装，使用该函数，你无需编写组件的 HTML 代码，就能打开一个对话框。

## 使用方法 {#usage}

按需导入函数：

```js
import { dialog } from 'mdui/functions/dialog.js';
```

使用示例：

```html,example
<mdui-button class="example-button">open</mdui-button>

<script type="module">
  import { dialog } from "mdui/functions/dialog.js";

  const button = document.querySelector(".example-button");

  button.addEventListener("click", () => {
    dialog({
      headline: "Dialog Title",
      description: "Dialog description",
      actions: [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onClick: () => {
            console.log("confirmed");
            return false;
          },
        }
      ]
    });
  });
</script>
```

## API {#api}

<pre><code class="nohighlight">dialog(options: <a href="#api-options">Options</a>): <a href="/zh-cn/docs/2/components/dialog">Dialog</a></code></pre>

函数接收一个 [Options](#api-options) 对象作为参数；返回值为 [`<mdui-dialog>`](/zh-cn/docs/2/components/dialog) 组件实例。

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
      <td colspan="3">dialog 的标题</td>
    </tr>
    <tr id="options-description">
      <td><a href="#options-description"><code>description</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">dialog 的描述文本</td>
    </tr>
    <tr id="options-body">
      <td><a href="#options-body"><code>body</code></a></td>
      <td><code>string</code> | <code>HTMLElement</code> | <code><a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">dialog 中的 body 内容，可以是 HTML 字符串、DOM 元素、或 <a href="/en/docs/2/functions/jq">JQ 对象</a>。</td>
    </tr>
    <tr id="options-icon">
      <td><a href="#options-icon"><code>icon</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">dialog 顶部的 Material Icons 图标名</td>
    </tr>
    <tr id="options-closeOnEsc">
      <td><a href="#options-closeOnEsc"><code>closeOnEsc</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否在按下 ESC 键时，关闭 dialog</td>
    </tr>
    <tr id="options-closeOnOverlayClick">
      <td><a href="#options-closeOnOverlayClick"><code>closeOnOverlayClick</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否在点击遮罩层时，关闭 dialog</td>
    </tr>
    <tr id="options-actions">
      <td><a href="#options-actions"><code>actions</code></a></td>
      <td><code><a href="#api-action">Action</a>[]</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">底部操作按钮数组</td>
    </tr>
    <tr id="options-stackedActions">
      <td><a href="#options-stackedActions"><code>stackedActions</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否垂直排列底部操作按钮</td>
    </tr>
    <tr id="options-queue">
      <td><a href="#options-queue"><code>queue</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>队列名称。</p>
        <p>默认不启用队列，在多次调用该函数时，将同时显示多个 dialog。</p>
        <p>可在该参数中传入一个队列名称，具有相同队列名称的 dialog 函数，将在上一个 dialog 关闭后才打开下一个 dialog。</p>
        <p><code>dialog()</code>、<a href="/zh-cn/docs/2/functions/alert"><code>alert()</code></a>、<a href="/zh-cn/docs/2/functions/confirm"><code>confirm()</code></a>、<a href="/zh-cn/docs/2/functions/prompt"><code>prompt()</code></a> 这四个函数的队列名称若相同，则也将互相共用同一个队列。</p>
      </td>
    </tr>
    <tr id="options-onOpen">
      <td><a href="#options-onOpen"><code>onOpen</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>dialog 开始打开时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onOpened">
      <td><a href="#options-onOpened"><code>onOpened</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>dialog 打开动画完成时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onClose">
      <td><a href="#options-onClose"><code>onClose</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>dialog 开始关闭时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onClosed">
      <td><a href="#options-onClosed"><code>onClosed</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>dialog 关闭动画完成时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
      </td>
    </tr>
    <tr id="options-onOverlayClick">
      <td><a href="#options-onOverlayClick"><code>onOverlayClick</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void</code></td>
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

### Action {#api-action}

<table>
  <thead>
    <tr>
      <th>属性名</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr id="action-text">
      <td><a href="#action-text"><code>text</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">按钮文本</td>
    </tr>
    <tr id="action-onClick">
      <td><a href="#action-onClick"><code>onClick</code></a></td>
      <td><code>(dialog: <a href="/zh-cn/docs/2/components/dialog">Dialog</a>) => void | boolean | Promise&lt;void&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>点击按钮时的回调函数。</p>
        <p>函数参数为 dialog 实例，<code>this</code> 也指向 dialog 实例。</p>
        <p>默认点击按钮后会关闭 dialog；若返回值为 <code>false</code>，则不关闭 dialog；若返回值为 promise，则将在 promise 被 resolve 后，关闭 dialog。</p>
      </td>
    </tr>
  </tbody>
</table>

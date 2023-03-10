`snackbar` 函数是对 [`<mdui-snackbar>`](/docs/2/components/snackbar) 组件的封装。使用该函数，你无需编写组件的 HTML 代码，就能打开一个 snackbar。

## 使用方法 {#usage}

按需导入函数：

```js
import { snackbar } from 'mdui/functions/snackbar.js';
```

使用示例：

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

<pre><code class="nohighlight">snackbar(options: <a href="#api-options">Options</a>): <a href="/docs/2/components/snackbar">Snackbar</a></code></pre>

函数的参数为 [Options](#api-options) 对象；返回值为 [`<mdui-snackbar>`](/docs/2/components/snackbar) 组件实例。

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
    <tr id="options-message">
      <td><a href="#options-message"><code>message</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">Snackbar 中的消息文本内容</td>
    </tr>
    <tr id="options-placement">
      <td><a href="#options-placement"><code>placement</code></a></td>
      <td><code>'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'</code></td>
      <td><code>bottom</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Snackbar 出现的位置。默认为 <code>bottom</code>。可选值为：</p>
        <ul>
          <li><code>top</code>：位于顶部，居中对齐</li>
          <li><code>top-start</code>：位于顶部，左对齐</li>
          <li><code>top-end</code>：位于顶部，右对齐</li>
          <li><code>bottom</code>：位于底部，居中对齐</li>
          <li><code>bottom-start</code>：位于底部，左对齐</li>
          <li><code>bottom-end</code>：位于底部，右对齐</li>
        </ul>
      </td>
    </tr>
    <tr id="options-action">
      <td><a href="#options-action"><code>action</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">操作按钮的文本</td>
    </tr>
    <tr id="options-closeable">
      <td><a href="#options-closeable"><code>closeable</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">是否在右侧显示关闭按钮</td>
    </tr>
    <tr id="options-messageLine">
      <td><a href="#options-messageLine"><code>messageLine</code></a></td>
      <td><code>1 | 2</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>消息文本最多显示几行。默认不限制行数。可选值为</p>
        <ul>
          <li><code>1</code>：消息文本最多显示一行</li>
          <li><code>2</code>：消息文本最多显示两行</li>
        </ul>
      </td>
    </tr>
    <tr id="options-autoCloseDelay">
      <td><a href="#options-autoCloseDelay"><code>autoCloseDelay</code></a></td>
      <td><code>number</code></td>
      <td><code>5000</code></td>
    </tr>
    <tr>
      <td colspan="3">在多长时间后自动关闭（单位为毫秒）。设置为 0 时，不自动关闭。默认为 5 秒后自动关闭。</td>
    </tr>
    <tr id="options-closeOnOutsideClick">
      <td><a href="#options-closeOnOutsideClick"><code>closeOnOutsideClick</code></a></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td colspan="3">点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar</td>
    </tr>
    <tr id="options-queue">
      <td><a href="#options-queue"><code>queue</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>队列名称。</p>
        <p>默认不启用队列，在多次调用该函数时，将同时显示多个 snackbar。</p>
        <p>可在该参数中传入一个队列名称，具有相同队列名称的 snackbar 函数，将在上一个 snackbar 关闭后才打开下一个 snackbar。</p>
      </td>
    </tr>
    <tr id="options-onClick">
      <td><a href="#options-onClick"><code>onClick</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>点击 Snackbar 时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
      </td>
    </tr>
    <tr id="options-onActionClick">
      <td><a href="#options-onActionClick"><code>onActionClick</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void | boolean | Promise&lt;void&gt;</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>点击操作按钮时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
        <p>默认点击后会关闭 snackbar；若返回值为 <code>false</code>，则不关闭 snackbar；若返回值为 promise，则将在 promise 被 resolve 后，关闭 snackbar。</p>
      </td>
    </tr>
    <tr id="options-onOpen">
      <td><a href="#options-onOpen"><code>onOpen</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Snackbar 开始显示时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
      </td>
    </tr>
    <tr id="options-onOpened">
      <td><a href="#options-onOpened"><code>onOpened</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Snackbar 显示动画完成时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
      </td>
    </tr>
    <tr id="options-onClose">
      <td><a href="options-onClose"><code>onClose</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Snackbar 开始隐藏时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
      </td>
    </tr>
    <tr id="options-onClosed">
      <td><a href="#options-onClosed"><code>onClosed</code></a></td>
      <td><code>(snackbar: <a href="/docs/2/components/snackbar">Snackbar</a>) => void</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>Snackbar 隐藏动画完成时的回调函数。</p>
        <p>函数参数为 snackbar 实例，<code>this</code> 也指向 snackbar 实例。</p>
      </td>
    </tr>
  </tbody>
</table>

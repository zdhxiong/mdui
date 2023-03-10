`setColorScheme` 函数用于根据一个给定的十六进制颜色值，设置配色方案。配色方案的设置会影响到页面中的所有 mdui 组件。

## 使用方法 {#usage}

按需导入函数：

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
```

使用示例：

```js
setColorScheme('#ff0000');
```

关于该函数的详细用法，请参见 [动态配色](/docs/2/styles/dynamic-color) 章节。

## API {#api}

<pre><code class="nohighlight">setColorScheme(color: string, options: <a href="#api-options">Options</a>): void;</code></pre>

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
    <tr id="options-target">
      <td><a href="#options-target"><code>target</code></a></td>
      <td><code>string | HTMLElement | <a href="/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;</code></td>
      <td><code>document.documentElement</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>要设置配色方案的元素。值可以是 CSS 选择器、DOM 元素、或 <a href="/docs/2/functions/jq">JQ 对象</a>。若设置了该参数，则配色方案仅在指定元素内生效。</p>
        <p>默认为 <code>document.documentElement</code>，即 <code>&lt;html&gt;</code> 元素，在整个页面生效。</p>
      </td>
    </tr>
    <tr id="options-customColors">
      <td><a href="#options-customColors"><code>customColors</code></a></td>
      <td><code><a href="#api-custom-color">CustomColor</a>[]</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">自定义颜色数组。使用方法请参见 <a href="/docs/2/styles/dynamic-color#color-scheme">动态配色</a> 章节。</td>
    </tr>
  </tbody>
</table>

### CustomColor {#api-custom-color}

<table>
  <thead>
    <tr>
      <th>属性名</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr id="custom-color-name">
      <td><a href="#custom-color-name"><code>name</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">自定义颜色名。</td>
    </tr>
    <tr id="custom-color-value">
      <td><a href="#custom-color-value"><code>value</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">自定义十六进制颜色值，如 <code>#f82506</code>。</td>
    </tr>
  </tbody>
</table>

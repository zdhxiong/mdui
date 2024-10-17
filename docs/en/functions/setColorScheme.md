The `setColorScheme` function is used to set the color scheme for the current page or a specific element based on a provided hexadecimal color value.

This function affects all mdui components on the page. For more information, refer to the [Dynamic Color](/en/docs/2/styles/dynamic-color) section.

## Usage {#usage}

Import the function:

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
```

Example:

```js
setColorScheme('#ff0000');
```

## API {#api}

<pre><code class="nohighlight">setColorScheme(color: string, options: <a href="#api-options">Options</a>): void;</code></pre>

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
    <tr id="options-target">
      <td><a href="#options-target"><code>target</code></a></td>
      <td><code>string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;</code></td>
      <td><code>document.documentElement</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>The element to which the color scheme should be applied. The value can be a CSS selector, a DOM element, or a <a href="/en/docs/2/functions/jq">JQ object</a>. If this parameter is set, the color scheme will only take effect within the specified element.</p>
        <p>The default value is <code>document.documentElement</code>, which refers to the <code>&lt;html&gt;</code> element and affects the entire page.</p>
      </td>
    </tr>
    <tr id="options-customColors">
      <td><a href="#options-customColors"><code>customColors</code></a></td>
      <td><code><a href="#api-custom-color">CustomColor</a>[]</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">An array of custom colors. For usage, please refer to the <a href="/en/docs/2/styles/dynamic-color#color-scheme">Dynamic Color</a> section.</td>
    </tr>
  </tbody>
</table>

### CustomColor {#api-custom-color}

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr id="custom-color-name">
      <td><a href="#custom-color-name"><code>name</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The name of the custom color.</td>
    </tr>
    <tr id="custom-color-value">
      <td><a href="#custom-color-value"><code>value</code></a></td>
      <td><code>string</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">The hexadecimal value of the custom color, such as <code>#f82506</code>.</td>
    </tr>
  </tbody>
</table>

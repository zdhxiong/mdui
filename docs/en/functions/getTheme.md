The `getTheme` function is used to obtain the current theme applied to the page or a specific element.

The available themes are `light`, `dark`, and `auto`. For more information, refer to the [Dark Mode](/en/docs/2/styles/dark-mode) section.

## Usage {#usage}

Import the function:

```js
import { getTheme } from 'mdui/functions/getTheme.js';
```

Example:

```js
// Get the theme on <html>
getTheme();

// Get the theme on an element with class="element"
getTheme('.element');

// Get the theme on a specified DOM element
const element = document.querySelector('.element');
getTheme(element);
```

## API {#api}

<pre><code class="nohighlight">getTheme(target?: string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): 'light' | 'dark' | 'auto'</code></pre>

This function retrieves the theme of a specified element. The target can be a CSS selector, a DOM element, or a [JQ object](/en/docs/2/functions/jq). If no target is provided, it defaults to the `<html>` element.

The function returns `light`, `dark`, or `auto`. If no theme is set on the element, it defaults to `light`.

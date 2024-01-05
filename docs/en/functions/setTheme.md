The `setTheme` function is used to apply a specific theme to the current page or a designated element. The available themes are `light`, `dark`, and `auto`. For more information, please refer to the [Dark Mode](/en/docs/2/styles/dark-mode) section.

## Usage {#usage}

Import the function:

```js
import { setTheme } from 'mdui/functions/setTheme.js';
```

Example:

```js
// Set the entire page to dark mode
setTheme('dark');

// Set an element with class="element" to dark mode
setTheme('dark', '.element');

// Set a specified DOM element to dark mode
const element = document.querySelector('.element');
setTheme('dark', element);
```

## API {#api}

<pre><code class="nohighlight">setTheme(theme: 'light' | 'dark' | 'auto', target?: string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): void</code></pre>

The function accepts two parameters. The first parameter, specifies the theme to be applied. It can be `light`, `dark`, or `auto`.

The second parameter, is optional and determines the element to which the theme will be applied. The target can be a CSS selector, a DOM element, or a [JQ object](/en/docs/2/functions/jq). If no target is provided, the function defaults to `document.documentElement`, the `<html>` element.

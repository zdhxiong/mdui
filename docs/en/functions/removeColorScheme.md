The `removeColorScheme` function is used to remove the color scheme from the current page or a specified element. For more details, see [Dynamic Color](/en/docs/2/styles/dynamic-color).

## Usage {#usage}

Import the function:

```js
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
```

Example:

```js
// Remove the color scheme from <html>
removeColorScheme();

// Remove the color scheme from an element with class="element"
removeColorScheme('.element');

// Remove the color scheme from a specified DOM element
const element = document.querySelector('.element');
removeColorScheme(element);
```

## API {#api}

<pre><code class="nohighlight">removeColorScheme(target?: string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): void</code></pre>

This function accepts an optional parameter, target, which specifies the element from which to remove the color scheme. The target can be a CSS selector, a DOM element, or a [JQ object](/en/docs/2/functions/jq). If no parameter is provided, the function defaults to `document.documentElement`, the `<html>` element.

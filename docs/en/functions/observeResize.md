# observeResize Function

The `observeResize` function lets you watch an element's size and run a callback when it changes.

This function uses the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API and follows a singleton pattern for better performance.

## Usage {#usage}

Import the function:

```js
import { observeResize } from 'mdui/functions/observeResize.js';
```

Example:

```js
// Listen for size changes on document.body
const observer = observeResize(document.body, function (entry, observer) {
  // At this point, document.body's size has changed. You can get the new size from entry.
  console.log(entry);

  // Call this method to stop observing
  observer.unobserve();
});

// You can also call the unobserve method on the function's return value to stop observing
observer.unobserve();
```

## API {#api}

<pre><code class="nohighlight">observeResize(target: string | HTMLElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;, callback: <a href="#api-callback">Callback</a>): <a href="#api-ObserveResize">ObserveResize</a></code></pre>

The `target` parameter can be a CSS selector, a DOM element, or a <a href="/en/docs/2/functions/jq">JQ object</a>.

### Callback {#api-Callback}

<pre><code class="nohighlight">(entry: <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry" target="_blank" rel="noopener nofollow">ResizeObserverEntry</a>, observer: <a href="#api-ObserveResize">ObserveResize</a>) => void</code></pre>

In this function, `this` also refers to [ObserveResize](#api-ObserveResize).

### ObserveResize {#api-ObserveResize}

```ts
{
  unobserve: () => void;
}
```

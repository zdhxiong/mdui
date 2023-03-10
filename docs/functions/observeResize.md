监听元素尺寸变化，在尺寸变化时，执行回调函数。该函数内部使用 [`ResizeObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 实现，不过实现了单例模式，因此使用该函数拥有更高的性能。

## 使用方法 {#usage}

按需导入函数：

```js
import { observeResize } from 'mdui/functions/observeResize.js';
```

使用示例：

```js
// 监听 document.body 的尺寸变化
const observer = observeResize(document.body, function(entry, observer) {
  // 此时 document.body 的尺寸发生了变化，可通过 entry 获取新的尺寸
  console.log(entry);

  // 可调用该方法取消监听
  observer.unobserve();
});

// 也可以调用函数返回值的 unobserve 方法取消监听
observer.unobserve();
```

## API {#api}

<pre><code class="nohighlight">observeResize(target: string | HTMLElement | <a href="/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;, callback: <a href="#api-callback">Callback</a>)): <a href="#api-ObserveResize">ObserveResize</a></code></pre>

`target` 参数可以是 CSS 选择器、DOM 元素、或 <a href="/docs/2/functions/jq">JQ 对象</a>。

### Callback {#api-Callback}

<pre><code class="nohighlight">(entry: <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserverEntry" target="_blank">ResizeObserverEntry</a>, observer: <a href="#api-ObserveResize">ObserveResize</a>) => void</code></pre>

该函数中的 `this` 也指向 [ObserveResize](#api-ObserveResize)。

### ObserveResize {#api-ObserveResize}

```ts
{
  unobserve: () => void;
}
```

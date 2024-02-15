`observeResize` 函数用于监听元素尺寸的变化，当尺寸发生变化时，会执行指定的回调函数。该函数使用 [`ResizeObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver) 实现，但采用了单例模式，因此性能更优。

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

<pre><code class="nohighlight">observeResize(target: string | HTMLElement | <a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;, callback: <a href="#api-callback">Callback</a>)): <a href="#api-ObserveResize">ObserveResize</a></code></pre>

`target` 参数可以是 CSS 选择器、DOM 元素、或 <a href="/zh-cn/docs/2/functions/jq">JQ 对象</a>。

### Callback {#api-Callback}

<pre><code class="nohighlight">(entry: <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserverEntry" target="_blank" rel="noopener nofollow">ResizeObserverEntry</a>, observer: <a href="#api-ObserveResize">ObserveResize</a>) => void</code></pre>

在回调函数中，`this` 指向 [ObserveResize](#api-ObserveResize)。

### ObserveResize {#api-ObserveResize}

```ts
{
  unobserve: () => void;
}
```

`removeColorScheme` 函数可移除在当前页面、或指定元素上设置的配色方案。参见 [动态配色](/docs/2/style/dynamic-color)。

## 使用方法 {#usage}

按需导入函数：

```js
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
```

使用示例：

```js
// 移除 <html> 上的配色方案
removeColorScheme();

// 移除 class="element" 元素上的配色方案
removeColorScheme('.element');

// 移除指定 DOM 元素上的配色方案
const element = document.querySelector('.element');
removeColorScheme(element);
```

## API {#api}

<pre><code class="nohighlight">removeColorScheme(target?: string | HTMLElement | <a href="/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): void</code></pre>

函数的参数为要移除配色方案的元素，值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](/docs/2/functions/jq)。若不传入参数，则默认为 `document.documentElement`，`<html>` 元素。

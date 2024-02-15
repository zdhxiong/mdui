`setTheme` 函数用于设置当前页面或指定元素的主题。可选的主题包括 `light`、`dark`和 `auto`。详见 [暗色模式](/zh-cn/docs/2/styles/dark-mode)。

## 使用方法 {#usage}

按需导入函数：

```js
import { setTheme } from 'mdui/functions/setTheme.js';
```

使用示例：

```js
// 把整个页面设置成暗色模式
setTheme('dark');

// 把 class="element" 元素设置成暗色模式
setTheme('dark', '.element');

// 把指定 DOM 元素设置成暗色模式
const element = document.querySelector('.element');
setTheme('dark', element);
```

## API {#api}

<pre><code class="nohighlight">setTheme(theme: 'light' | 'dark' | 'auto', target?: string | HTMLElement | <a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): void</code></pre>

函数的第一个参数是要设置的主题，可选值为 `light`、`dark`、`auto`。

第二个参数是要设置主题的元素，可以是 CSS 选择器、DOM 元素，或 [JQ 对象](/zh-cn/docs/2/functions/jq)。如果不传入第二个参数，那么默认设置 `<html>` 元素的主题。

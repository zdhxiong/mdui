`getTheme` 函数用于获取当前页面的主题、或在指定元素上设置的主题。主题包括 `light`、`dark`、`auto` 三种，参见 [暗色模式](/zh-cn/docs/2/styles/dark-mode)。

## 使用方法 {#usage}

按需导入函数：

```js
import { getTheme } from 'mdui/functions/getTheme.js';
```

使用示例：

```js
// 获取 <html> 上的主题
getTheme();

// 获取 class="element" 元素上的主题
getTheme('.element');

// 获取指定 DOM 元素上的主题
const element = document.querySelector('.element');
getTheme(element);
```

## API {#api}

<pre><code class="nohighlight">getTheme(target?: string | HTMLElement | <a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLElement&gt;): 'light' | 'dark' | 'auto'</code></pre>

函数的参数为要获取哪个元素的主题，值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](/zh-cn/docs/2/functions/jq)。若不传入参数，则默认为 `<html>` 元素。

函数的返回值为 `light`、`dark`、`auto` 之一，若元素上未设置过主题，则默认为 `light`。

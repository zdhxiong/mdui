`getColorFromImage` 函数用于从指定图片中提取主色调。获取主色调后，你可以使用 [`setColorScheme`](/zh-cn/docs/2/functions/setColorScheme) 函数来设置配色方案，从而实现[动态配色](/zh-cn/docs/2/styles/dynamic-color)功能。

## 使用方法 {#usage}

按需导入函数：

```js
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
```

使用示例：

```js
const image = new Image();
image.src = "demo.png";

getColorFromImage(image).then(color => {
  console.log(color);
});
```

## API {#api}

<pre><code class="nohighlight">getColorFromImage(image: string | HTMLImageElement | <a href="/zh-cn/docs/2/functions/jq">JQ</a>&lt;HTMLImageElement&gt;): Promise&lt;string&gt;</code></pre>

函数接收一个 `<img>` 元素的 CSS 选择器、或 `HTMLImageElement` 对象，或包含 `<img>` 元素的 [JQ 对象](/zh-cn/docs/2/functions/jq) 作为参数。

返回值为 Promise，Promise 的值为图片主色调的十六进制颜色值（如 `#ff0000`）。

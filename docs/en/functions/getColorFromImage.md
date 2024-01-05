The `getColorFromImage` function is designed to extract the dominant color from an image. The extracted color can be used in conjunction with the [`setColorScheme`](/en/docs/2/functions/setColorScheme) function to implement [dynamic color](/en/docs/2/styles/dynamic-color) functionality.


## Usage {#usage}

Import the function:

```js
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
```

Example:

```js
const image = new Image();
image.src = "demo.png";

getColorFromImage(image).then(color => {
  console.log(color);
});
```

## API {#api}

<pre><code class="nohighlight">getColorFromImage(image: string | HTMLImageElement | <a href="/en/docs/2/functions/jq">JQ</a>&lt;HTMLImageElement&gt;): Promise&lt;string&gt;</code></pre>

This function takes a CSS selector for an `<img>` element, an `HTMLImageElement` object, or a [JQ object](/en/docs/2/functions/jq) representing an `<img>` element as its parameter.

It returns a Promise that resolves to the hexadecimal color value of the dominant color in the image (e.g., `#ff0000`).

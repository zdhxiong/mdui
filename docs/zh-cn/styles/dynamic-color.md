mdui 支持动态配色。你只需给出一个颜色值，mdui 会自动生成一套完整的配色方案。同时还支持从给定的壁纸中提取主色调，并生成配色方案。

你可以随时点击文档页面右上角的 <mdui-icon name="palette--outlined" style="vertical-align: middle"></mdui-icon> 图标来切换配色方案，以查看各个组件在不同配色方案下的显示效果。

一套配色方案即为一组 CSS 自定义属性，mdui 组件中的颜色值都引用了这一组 CSS 自定义属性，因此能一次性更新所有组件的配色方案。完整 CSS 自定义属性列表可参见 [设计令牌 - 颜色](/zh-cn/docs/2/styles/design-tokens#color)。

## 生成配色方案 {#color-scheme}

你可以使用 [`setColorScheme`](/zh-cn/docs/2/functions/setColorScheme) 函数来生成配色方案，该函数接受一个十六进制颜色值作为参数，生成一套配色方案，并将页面的 `<html>` 设置为该配色方案。例如：

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// 根据 #0061a4 生成一套配色方案，并将 <html> 设置为该配色方案
setColorScheme('#0061a4');
```

你还可以在第二个参数中指定 `target` 属性，用于指明在哪个元素上设置配色方案。例如：

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// 根据 #0061a4 生成一套配色方案，并将 .foo 元素设置为该配色方案
setColorScheme('#0061a4', {
  target: document.querySelector('.foo')
});
```

默认情况下生成的配色方案仅包含 [设计令牌 - 颜色](/zh-cn/docs/2/styles/design-tokens#color) 中所列出的颜色，你可以在第二个参数中指定 `customColors` 属性，mdui 会根据你给出的自定义颜色名和颜色值生成一组自定义颜色组。例如：

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// 根据 #0061a4 生成一套配色方案，并修改了原有的 error 颜色组的值，并添加了一组新的 music 颜色组
setColorScheme('#0061a4', {
  customColors: [
    {
      name: 'error',
      value: '#69F0AE'
    },
    {
      name: 'music',
      value: '#FFC107'
    }
  ]
});
```

一组自定义颜色组包含四个 CSS 自定义属性：

* `--mdui-color-{name}`
* `--mdui-color-on-{name}`
* `--mdui-color-{name}-container`
* `--mdui-color-on-{name}-container`

其中的 `{name}` 为你传入的 `customColors` 中的 `name` 字段名，即自定义颜色名。

自定义颜色名可以是默认配色方案中的已有颜色名，如 `primary`、`secondary`、`tertiary`、`error` 这些都是默认配色方案中已包含的。如果你指定了这些值作为自定义颜色名，则生成的配色方案中对应的四个 CSS 自定义属性，将用你指定的颜色值来生成。例如上面示例中指定了名为 `error` 的自定义颜色名，因为 `error` 是默认配色方案中已有的颜色名，且其对应的 CSS 自定义属性被 mdui 组件用于表示错误状态，因为现在颜色值被设置为一个绿色的值，所以 mdui 组件中的错误状态也将变为绿色。

自定义颜色名也可以是新增的，例如上面示例中的 `music`，是默认配色方案中不存在的，则生成的配色方案将额外包含四个 CSS 自定义属性。可以在你自己的样式中引用这些 CSS 自定义属性：

```html
<style>
  .music {
    background-color: rgb(var(--mdui-color-music));
    color: rgb(var(--mdui-color-on-music));
  }

  .music-container {
    background-color: rgb(var(--mdui-color-music-container));
    color: rgb(var(--mdui-color-on-music-container));
  }
</style>

<div class="music">Music</div>
<div class="music-container">Music Container</div>
```

你还可以使用 [`removeColorScheme`](/zh-cn/docs/2/functions/removeColorScheme) 函数来移除通过上述方法生成的配色方案。可传入参数指定移除在哪个元素上设置的配色方案，默认移除 `<html>` 上的配色方案。

## 从壁纸中提取颜色 {#from-wallpaper}

mdui 提供了 [`getColorFromImage`](/zh-cn/docs/2/functions/getColorFromImage) 函数，用于从一个给定的 `Image` 实例中提取出主色调。该函数返回 Promise，resolve 的值即为提取的十六进制颜色值。

你可以使用从该函数获得的颜色值，再调用上面文档介绍的 [`setColorScheme`](/zh-cn/docs/2/functions/setColorScheme) 函数来设置配色方案。例如：

```js
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

const image = new Image();
image.src = 'image1.png';

getColorFromImage(image).then(color => setColorScheme(color));
```

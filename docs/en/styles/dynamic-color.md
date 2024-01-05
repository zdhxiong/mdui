mdui supports dynamic theming. By providing a color value, mdui generates a comprehensive color scheme. It can also extract the dominant color from a wallpaper and create a color scheme based on it.

Click the palette icon <mdui-icon name="palette--outlined" style="vertical-align: middle"></mdui-icon> in the top right corner of the documentation page to toggle between color schemes and observe the appearance of various components under different color schemes.

A color scheme in mdui is a set of CSS custom properties. mdui components reference these properties for their color values, enabling you to update the entire color scheme simultaneously. Refer to [Design Tokens - Color](/en/docs/2/styles/design-tokens#color) for a complete list of CSS custom properties.

## Generating a Color Scheme {#color-scheme}

The [`setColorScheme`](/en/docs/2/functions/setColorScheme) function generates a color scheme. It accepts a hexadecimal color value, generates a color scheme based on it, and applies it to the `<html>` element of the page. For example:

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// Generate a color scheme based on #0061a4 and set the <html> element to that color scheme
setColorScheme('#0061a4');
```

You can specify the `target` property in the second parameter to apply the color scheme to a specific element. For example:

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// Generate a color scheme based on #0061a4 and apply it to the .foo element
setColorScheme('#0061a4', {
  target: document.querySelector('.foo')
});
```

By default, the generated color scheme includes only the colors listed in [Design Tokens - Color](/en/docs/2/styles/design-tokens#color). You can include custom color groups by specifying the `customColors` property in the second parameter. Provide your custom color names and values as shown:

```js
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

// Generate a color scheme based on #0061a4, modify the value of the existing error color group, and add a new music color group
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

A custom color group includes four CSS custom properties:

* `--mdui-color-{name}`
* `--mdui-color-on-{name}`
* `--mdui-color-{name}-container`
* `--mdui-color-on-{name}-container`

Here, `{name}` is the custom color `name` you provided in the `customColors` field.

Custom color names can be existing color names from the default color scheme, such as `primary`, `secondary`, `tertiary`, `error`, etc. If you specify these values as custom color names, the corresponding four CSS custom properties in the generated color scheme will use the color values you specified. For example, in the above example, the custom color name `error` is specified, and since `error` is an existing color name in the default color scheme, its corresponding CSS custom properties are used by mdui components to represent error states. Now, because the color value is set to a green color, the error state in mdui components will also become green.

Custom color names can also be new ones, such as `music` in the above example, which does not exist in the default color scheme. In this case, the generated color scheme will additionally include four CSS custom properties. You can reference these CSS custom properties in your own styles:

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

You can also use the [`removeColorScheme`](/en/docs/2/functions/removeColorScheme) function to remove a color scheme. Specify a parameter to remove the color scheme from a specific element. By default, it removes the color scheme from the `<html>` element.

## Extracting Colors from Wallpaper {#from-wallpaper}

The [`getColorFromImage`](/en/docs/2/functions/getColorFromImage) function in mdui extracts the dominant color from an Image instance. This function returns a Promise that resolves to the extracted hexadecimal color value.

You can use this color value with the [`setColorScheme`](/en/docs/2/functions/setColorScheme) function to set the color scheme. For example:

```js
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

const image = new Image();
image.src = 'image1.png';

getColorFromImage(image).then(color => setColorScheme(color));
```

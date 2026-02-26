# @mdui/icons

`@mdui/icons` is a standalone package that contains all the Material Icons as individual files.

You can import only the icons you need without having to import the entire icon library. Therefore, using `@mdui/icons` can significantly reduce the size of your project bundle compared to using the [`<mdui-icon>`](/en/docs/2/components/icon) component.

## Installation {#installation}

You can install the package independently:

```bash
npm install @mdui/icons --save
```

## Usage {#usage}

After installation, you can import the necessary icon files:

```js
import '@mdui/icons/search.js';
```

Then, you can use the corresponding icon component in your HTML:

```html
<mdui-icon-search></mdui-icon-search>
```

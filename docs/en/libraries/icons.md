`@mdui/icons` is a standalone package that encompasses all Material Icons. Each icon is encapsulated in a separate file, facilitating selective imports. This approach can significantly decrease the bundle size of your project, compared to using the [`<mdui-icon>`](/en/docs/2/components/icon) component.

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

Then, you can utilize the corresponding icon component in your HTML:

```html
<mdui-icon-search></mdui-icon-search>
```

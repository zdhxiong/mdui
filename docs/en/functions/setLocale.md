The `setLocale` function sets the current locale code. For more details, refer to [Localization](/en/docs/2/getting-started/localization).

## Usage {#usage}

Import the function:

```js
import { setLocale } from 'mdui/functions/setLocale.js';
```

Example:

```js
setLocale('zh-cn').then(() => {
  // The locale switch is complete when the promise resolves
});
```

## API {#api}

```ts
setLocale(LocaleCode): Promise<void>
```

This function accepts a locale code as an argument and returns a Promise. The locale switch is complete when the Promise resolves.

Refer to [Supported Languages](/en/docs/2/getting-started/localization#languages) for a list of locale codes.

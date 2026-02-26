# loadLocale Function

The `loadLocale` function loads locale modules. For more details, see [Localization](/en/docs/2/getting-started/localization).

## Usage {#usage}

Import the function:

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
```

Here are a few common ways to load locale modules. For detailed explanations, see [Localization](/en/docs/2/getting-started/localization).

Dynamic import (Lazy-load):

```js
loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));
```

Dynamic import (Pre-load):

```js
const localizedTemplates = new Map([
  ['zh-cn', import(`../node_modules/mdui/locales/zh-cn.js`)],
  ['zh-tw', import(`../node_modules/mdui/locales/zh-tw.js`)],
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

Static imports:

```js
import * as locale_zh_cn from 'mdui/locales/zh-cn.js';
import * as locale_zh_tw from 'mdui/locales/zh-tw.js';

const localizedTemplates = new Map([
  ['zh-cn', locale_zh_cn],
  ['zh-tw', locale_zh_tw],
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

## API {#api}

```ts
loadLocale((LocaleTargetCode) => Promise<LocaleModule>): void;
```

This function accepts a function that defines how to load the locale modules. The loader function takes a locale code and returns a Promise that resolves to the matching locale module.

Refer to [Supported Languages](/en/docs/2/getting-started/localization#languages) for a list of locale codes. `en-us` is the built-in locale module and does not need to be loaded.

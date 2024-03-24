`loadLocale` 函数用于加载语言包。详见 [本地化](/zh-cn/docs/2/getting-started/localization)。

## 使用方法 {#usage}

按需导入函数：

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
```

下面列举了几种常见的语言包加载方式，详细说明可参见 [本地化](/zh-cn/docs/2/getting-started/localization)。

动态导入（懒加载）：

```js
loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));
```

动态导入（预加载）：

```js
const localizedTemplates = new Map([
  ['zh-cn', import(`../node_modules/mdui/locales/zh-cn.js`)],
  ['zh-tw', import(`../node_modules/mdui/locales/zh-tw.js`)]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

静态导入：

```js
import * as locale_zh_cn from 'mdui/locales/zh-cn.js';
import * as locale_zh_tw from 'mdui/locales/zh-tw.js';

const localizedTemplates = new Map([
  ['zh-cn', locale_zh_cn],
  ['zh-tw', locale_zh_tw]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

## API {#api}

```ts
loadLocale((LocaleTargetCode) => Promise<LocaleModule>): void;
```

函数的参数为一个定义了如何加载语言包的函数。语言包加载函数的参数为语言代码，返回值为 Promise，resolve 的值为对应的语言包模块。

语言代码列表参见 [支持的语言](/zh-cn/docs/2/getting-started/localization#languages)，其中 `en-us` 为内置语言，无需加载。

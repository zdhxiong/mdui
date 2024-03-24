mdui uses English by default. If you wish to use other languages, you'll need to do some localization configuration.

## Usage {#usage}

mdui provides three functions for localization:

* [`loadLocale`](/en/docs/2/functions/loadLocale): Loads locale modules. Accepts a function that takes a locale code and returns a Promise resolving to the locale module. Ensure to call this function in your project's entry file.
* [`setLocale`](/en/docs/2/functions/setLocale): Begins switching the active locale to the given locale code, and returns a promise that resolves when the new locale has loaded.
* [`getLocale`](/en/docs/2/functions/getLocale): Returns the active locale code.

Example usage:

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
import { setLocale } from 'mdui/functions/setLocale.js';
import { getLocale } from 'mdui/functions/getLocale.js';

// Load locale modules in the entry point of your project
loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));

// Switch locale, and returns a promise that resolves when the new locale has loaded
setLocale('zh-cn').then(() => {
  // You can use getLocale() to get the current locale code
  console.log(getLocale()); // zh-cn
});
```

## Status Events {#event}

The `mdui-localize-status` event fires on `window` whenever a locale switch starts, finishes, or fails. You can listen to this event to execute custom operations, such as setting a locale preference cookie.

The `detail.status` string property tells you what kind of status change has occured, and can be either `loading`, `ready`, or `error`:

<table>
  <thead>
    <tr>
      <th><code>detail.status</code></th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>loading</code></td>
      <td>
        <p>A new locale has started to load.</p>
        <p>The <code>detail</code> object contains:</p>
        <ul>
          <li><code>loadingLocale</code>: Code of the locale that has started loading.</li>
        <ul>
      </td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td>
        <p>A new locale has successfully loaded.</p>
        <p>The <code>detail</code> object contains:</p>
        <ul>
          <li><code>readyLocale</code>: Code of the locale that has successfully loaded.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>error</code></td>
      <td>
        <p>A new locale failed to load.</p>
        <p>The <code>detail</code> object contains:</p>
        <ul>
          <li><code>errorLocale</code>: Code of the locale that failed to load.</li>
          <li><code>errorMessage</code>: Error message from locale load failure.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Example of using the status event:

```js
window.addEventListener('mdui-localize-status', (event) => {
  if (event.detail.status === 'loading') {
    console.log(`Loading new locale: ${event.detail.loadingLocale}`);
  } else if (event.detail.status === 'ready') {
    console.log(`Loaded new locale: ${event.detail.readyLocale}`);
  } else if (event.detail.status === 'error') {
    console.error(`Error loading locale ${event.detail.errorLocale}: ${event.detail.errorMessage}`);
  }
});
```

## Approaches for loading locale modules {#load-locale}

### Lazy-load {#lazy-load}

Use [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) to load each locale only when it becomes active. This is a good default because it minimizes the amount of code that your users will download and execute.

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';

loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));
```

### Pre-load {#pre-load}

Start pre-loading all locales when the page loads. Dynamic imports are still used to ensure that the remaining script on the page is not blocked while the locale modules are being fetched.

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';

const localizedTemplates = new Map([
  ['zh-cn', import(`../node_modules/mdui/locales/zh-cn.js`)],
  ['zh-tw', import(`../node_modules/mdui/locales/zh-tw.js`)]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

### Static imports {#static-imports}

Use [static imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) to pre-load all locales in a way that blocks other script on the page.

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
import * as locale_zh_cn from 'mdui/locales/zh-cn.js';
import * as locale_zh_tw from 'mdui/locales/zh-tw.js';

const localizedTemplates = new Map([
  ['zh-cn', locale_zh_cn],
  ['zh-tw', locale_zh_tw]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

## Loading Locale Modules via CDN {#cdn}

When using mdui via CDN, you can directly load locale modules from the CDN:

```html
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>

<script>
mdui.loadLocale((locale) => import(`https://unpkg.com/mdui@2/locales/${locale}.js`));
mdui.setLocale('zh-cn');
</script>
```

## Supported Languages {#languages}

mdui supports the following locales:

| Language                 | Locale Code |
| ------------------------ | ----------- |
| Arabic                   | ar-eg       |
| Azerbaijani              | az-az       |
| Bulgarian                | bg-bg       |
| Bangla (Bangladesh)      | bn-bd       |
| Belarusian               | be-by       |
| Catalan                  | ca-es       |
| Czech                    | cs-cz       |
| Danish                   | da-dk       |
| German                   | de-de       |
| Greek                    | el-gr       |
| English (United Kingdom) | en-gb       |
| English                  | en-us       |
| Spanish                  | es-es       |
| Estonian                 | et-ee       |
| Persian                  | fa-ir       |
| Finnish                  | fi-fi       |
| French (Belgium)         | fr-be       |
| French (Canada)          | fr-ca       |
| French (France)          | fr-fr       |
| Irish (Ireland)          | ga-ie       |
| Galician (Spain)         | gl-es       |
| Hebrew                   | he-il       |
| Hindi                    | hi-in       |
| Croatian                 | hr-hr       |
| Hungarian                | hu-hu       |
| Armenian                 | hy-am       |
| Indonesian               | id-id       |
| Italian                  | it-it       |
| Icelandic                | is-is       |
| Japanese                 | ja-jp       |
| Georgian                 | ka-ge       |
| Khmer                    | km-kh       |
| Kurdish (Kurmanji)       | kmr-iq      |
| Kannada                  | kn-in       |
| Kazakh                   | kk-kz       |
| Korean                   | ko-kr       |
| Lithuanian               | lt-lt       |
| Latvian                  | lv-lv       |
| Macedonian               | mk-mk       |
| Malayalam (India)        | ml-in       |
| Mongolian                | mn-mn       |
| Malay (Malaysia)         | ms-my       |
| Norwegian                | nb-no       |
| Nepal                    | ne-np       |
| Dutch (Belgium)          | nl-be       |
| Dutch                    | nl-nl       |
| Polish                   | pl-pl       |
| Portuguese (Brazil)      | pt-br       |
| Portuguese               | pt-pt       |
| Romanian                 | ro-ro       |
| Russian                  | ru-ru       |
| Slovak                   | sk-sk       |
| Serbian                  | sr-rs       |
| Slovenian                | sl-si       |
| Swedish                  | sv-se       |
| Tamil                    | ta-in       |
| Thai                     | th-th       |
| Turkish                  | tr-tr       |
| Urdu (Pakistan)          | ur-pk       |
| Ukrainian                | uk-ua       |
| Vietnamese               | vi-vn       |
| Chinese (Simplified)     | zh-cn       |
| Chinese (Traditional)    | zh-hk       |
| Chinese (Traditional)    | zh-tw       |

## Submitting New Translations or Improvements {#contribute}

To contribute new translations or improvements to existing translations, please submit a pull request on GitHub.  Translations are located in [`packages/mdui/src/xliff`](https://github.com/zdhxiong/mdui/tree/v2/packages/mdui/src/xliff) and can be edited directly on GitHub if you don’t want to clone the repo locally.

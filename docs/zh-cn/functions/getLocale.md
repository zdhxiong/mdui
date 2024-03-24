`getLocale` 函数用于获取当前的本地化语言代码。详见 [本地化](/zh-cn/docs/2/getting-started/localization)。

## 使用方法 {#usage}

按需导入函数：

```js
import { getLocale } from 'mdui/functions/getLocale.js';
```

使用示例：

```js
// 获取当前的本地化语言代码
getLocale();
```

## API {#api}

```ts
getLocale(): LocaleCode
```

函数的返回值为语言代码，语言代码列表参见 [支持的语言](/zh-cn/docs/2/getting-started/localization#languages)。

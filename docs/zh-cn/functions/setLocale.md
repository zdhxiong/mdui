`setLocale` 函数用于设置当前的本地化语言代码。详见 [本地化](/zh-cn/docs/2/getting-started/localization)。

## 使用方法 {#usage}

按需导入函数：

```js
import { setLocale } from 'mdui/functions/setLocale.js';
```

使用示例：

```js
setLocale('zh-cn').then(() => {
  // promise 被 resolve 时，语言切换完成
});
```

## API {#api}

```ts
setLocale(LocaleCode): Promise<void>
```

函数的参数为语言代码，返回值为 Promise，在 Promise resolve 时，语言切换完成。

语言代码列表参见 [支持的语言](/zh-cn/docs/2/getting-started/localization#languages)。

import { $ } from '../$.js';
import { ajaxSetup } from '../functions/ajaxSetup.js';
import type { Options } from '../shared/ajax.js';

declare module '../shared/core.js' {
  interface JQStatic {
    /**
     * 为 Ajax 请求设置全局配置参数
     * @param options 键值对参数
     * @example
```js
$.ajaxSetup({
  dataType: 'json',
  method: 'POST',
});
```
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ajaxSetup<TResponse = any>(options: Options<TResponse>): Options<TResponse>;
  }
}

$.ajaxSetup = ajaxSetup;

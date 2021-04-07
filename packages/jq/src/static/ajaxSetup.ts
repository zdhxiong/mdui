import $ from '../$.js';
import ajaxSetup from '../functions/ajaxSetup.js';
import { AjaxOptions } from '../interfaces/AjaxOptions.js';

declare module '../interfaces/JQStatic.js' {
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
    ajaxSetup(options: AjaxOptions): AjaxOptions;
  }
}

$.ajaxSetup = ajaxSetup;

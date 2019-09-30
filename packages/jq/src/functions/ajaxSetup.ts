import extend from '../functions/extend';
import AjaxOptions from '../interfaces/AjaxOptions';
import { globalOptions } from './utils/ajax';

/**
 * 为 Ajax 请求设置全局配置参数
 * @param options 键值对参数
 * @example
```js
ajaxSetup({
  dataType: 'json',
  method: 'POST',
});
```
 */
function ajaxSetup(options: AjaxOptions): AjaxOptions {
  return extend(globalOptions, options);
}

export default ajaxSetup;

import extend from './extend.js';
import { AjaxOptions } from '../interfaces/AjaxOptions.js';
import { globalOptions } from './utils/ajax.js';

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
const ajaxSetup = (options: AjaxOptions): AjaxOptions => {
  return extend(globalOptions, options);
};

export default ajaxSetup;

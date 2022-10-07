import { globalOptions } from '../shared/ajax.js';
import { extend } from './extend.js';
import type { Options } from '../shared/ajax.js';

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
export const ajaxSetup = (options: Options): Options => {
  return extend(globalOptions, options);
};

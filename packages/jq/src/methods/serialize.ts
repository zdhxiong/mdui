import $ from '../$';
import param from '../functions/param';
import { JQ } from '../JQ';
import './serializeArray';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 将表单元素数组或者对象序列化
     * @example
```js
$('form').serialize();
// golang=456&name=mdui&password=
```
     */
    serialize(): string;
  }
}

/**
 * 将表单元素或对象序列化
 * @returns {String}
 */
$.fn.serialize = function(this: JQ): string {
  return param(this.serializeArray());
};

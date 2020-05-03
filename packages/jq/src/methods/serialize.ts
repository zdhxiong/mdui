import $ from '../$';
import param from '../functions/param';
import { JQ } from '../JQ';
import './serializeArray';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把表单元素的值编译为字符串
     * @example
```js
$('form').serialize();
// golang=456&name=mdui&password=
```
     */
    serialize(): string;
  }
}

$.fn.serialize = function (this: JQ): string {
  return param(this.serializeArray());
};

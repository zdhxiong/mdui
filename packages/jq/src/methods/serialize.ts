import $ from '../$.js';
import param from '../functions/param.js';
import { JQ } from '../shared/core.js';
import './serializeArray.js';

declare module '../shared/core.js' {
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

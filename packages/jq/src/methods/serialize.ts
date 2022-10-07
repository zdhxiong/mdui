import { $ } from '../$.js';
import { param } from '../functions/param.js';
import './serializeArray.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

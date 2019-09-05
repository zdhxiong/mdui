import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';

interface Coordinates {
  left: number;
  top: number;
  width: number;
  height: number;
}

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取当前元素相对于 document 的偏移
     * @example
```js
$('.box').offset();
// { top: 20, left: 30, width: 200, height: 100 }
```
     */
    offset(): Coordinates | undefined;
  }
}

$.fn.offset = function(this: JQ): Coordinates | undefined {
  const element = this[0];

  if (element && isElement(element)) {
    const offset = element.getBoundingClientRect();

    return {
      left: offset.left + window.pageXOffset,
      top: offset.top + window.pageYOffset,
      width: offset.width,
      height: offset.height,
    };
  }

  return undefined;
};

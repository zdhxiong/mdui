import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 遍历 JQ 对象，为每个元素执行一个函数。如果函数返回 false，则结束遍历。
     * 函数的第一个参数为元素的索引号，第二个参数为当前元素。函数的 this 关键字指向当前元素
     * @param callback
     * @example
```js
$('img').each(function (index, element) {
  this.src = 'test' + index + '.jpg';
});
```
     */
    each(callback: (this: T, index: number, element: T) => void | any): this;
  }
}

$.fn.each = function(this: JQ, callback: void | any): JQ {
  return each(this, callback) as JQ;
};

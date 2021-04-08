import $ from '../$.js';
import { JQ } from '../shared/core.js';
import './each.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 删除集合中每个元素上的指定属性
     * @param name 属性名
     * @example
```js
$('input').removeProp('disabled')
```
     */
    removeProp(name: string): this;
  }
}

$.fn.removeProp = function (this: JQ, name: string): JQ {
  return this.each(function () {
    try {
      // @ts-ignore
      delete this[name];
    } catch (e) {}
  });
};

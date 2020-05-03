import $ from '../$';
import { JQ } from '../JQ';
import './each';

declare module '../JQ' {
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

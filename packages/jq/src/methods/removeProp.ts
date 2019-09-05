import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 删除属性值
     * @param name
     * @example
```js
$('input').removeProp('disabled')
```
     */
    removeProp(name: string): this;
  }
}

$.fn.removeProp = function(this: JQ, name: string): JQ {
  return this.each(function() {
    try {
      // @ts-ignore
      delete this[name];
    } catch (e) {}
  });
};

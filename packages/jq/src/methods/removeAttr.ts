import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 移除指定属性，多个属性可以用空格分隔
     * @param attributeName
     * @example
```js
$('div').removeAttr('title')
```
     */
    removeAttr(attributeName: string): this;
  }
}

$.fn.removeAttr = function(this: JQ, attributeName: string): JQ {
  const names = attributeName.split(' ').filter(name => name);

  return this.each(function() {
    each(names, (_, name) => {
      this.removeAttribute(name);
    });
  });
};

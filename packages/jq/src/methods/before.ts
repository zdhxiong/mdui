import JQSelector from '../types/JQSelector';
import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './insertBefore';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 把指定元素插入到当前元素前面
     * @param selector
     * @example
```js
$('<p>I would like to say: </p>').before('<b>Hello</b>')
// [ <b>Hello</b><p>I would like to say: </p> ]
```
     */
    before(selector: JQSelector): this;
  }
}

$.fn.before = function(this: JQ, selector: JQSelector): JQ {
  $(selector).insertBefore(this);

  return this;
};

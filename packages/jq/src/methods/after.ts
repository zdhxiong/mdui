import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './insertAfter';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 在当前元素后面插入指定内容
     * @param selector
     * @example
```js
$('<p>I would like to say: </p>').after('<b>Hello</b>')
// [ <p>I would like to say: </p><b>Hello</b> ]
```
     */
    after(selector: JQSelector): this;
  }
}

$.fn.after = function(this: JQ, selector: JQSelector): JQ {
  $(selector).insertAfter(this);

  return this;
};

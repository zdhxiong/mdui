import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './prepend';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 前置到指定元素内部
     * @param selector
     * @example
```js
$('<p>Hello</p>').prependTo('<p>I would like to say: </p>')
// [ <p><p>Hello</p>I would like to say: </p> ]
```
     */
    prependTo(selector: JQSelector): this;
  }
}

$.fn.prependTo = function(this: JQ, selector: JQSelector): JQ {
  $(selector).prepend(this);

  return this;
};

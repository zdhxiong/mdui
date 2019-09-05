import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './append';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 把当前元素追加到指定元素内部的后面
     * @param selector
     * @example
```js
$('<p>Hello</p>').appendTo('<p>I would like to say: </p>')
// [ <p>I would like to say: <p>Hello</p></p> ]
```
     */
    appendTo(selector: JQSelector): this;
  }
}

$.fn.appendTo = function(this: JQ, selector: JQSelector): JQ {
  $(selector).append(this);

  return this;
};

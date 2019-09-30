import HTMLString from '../types/HTMLString';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './prepend';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 前置到指定元素内部
     * @param selector
     * @example
```js
$('<p>Hello</p>').prependTo('<p>I would like to say: </p>')
// [ <p><p>Hello</p>I would like to say: </p> ]
```
     */
    prependTo(target: Selector | HTMLString | TypeOrArray<Element> | JQ): this;
  }
}

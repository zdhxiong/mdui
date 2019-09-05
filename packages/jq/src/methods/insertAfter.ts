import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import './insertBefore';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 把当前元素插入到指定元素的后面
     * @param selector
     * @example
```js
$('<b>Hello</b>').insertAfter('<p>I would like to say: </p>');
// [ <p>I would like to say: </p><b>Hello</b> ]
```
     */
    insertAfter(selector: JQSelector): this;
  }
}

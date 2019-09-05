import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import './append';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 在选中元素内部的前面插入指定内容
     * @param contents 可以是字符串、HTML、JQ 对象、DOM 元素、DOM 元素数组、NodeList 等
     * @example
```js
$('<p>I would like to say: </p>').prepend('<b>Hello</b>');
// [ <p><b>Hello</b>I would like to say: </p> ]
```
     */
    prepend(contents: JQSelector): this;
  }
}

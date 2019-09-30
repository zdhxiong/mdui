import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import './append';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在选中元素内部的前面插入指定内容
     * @param contents
     * @example
```js
$('<p>I would like to say: </p>').prepend('<b>Hello</b>');
// [ <p><b>Hello</b>I would like to say: </p> ]
```
     */
    prepend(
      ...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>
    ): this;

    /**
     * 在选中元素内部的前面插入指定内容
     * @param callback
     */
    prepend(
      callback: (
        this: T,
        index: number,
        html: string,
      ) => HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}

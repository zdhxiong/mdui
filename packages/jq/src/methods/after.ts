import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import './before';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素后面插入指定内容
     * @param selector
     * @returns 未插入元素之前的集合
     * @example
```js
$('<p>I would like to say: </p>').after('<b>Hello</b>')
// [ <p>I would like to say: </p><b>Hello</b> ]
```
     */
    after(...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>): this;

    /**
     * 在当前元素后面插入指定内容
     * @param callback
     * @returns 未插入元素之前的集合
     */
    after(
      callback: (
        this: T,
        index: number,
        oldHtml: string,
      ) => HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}

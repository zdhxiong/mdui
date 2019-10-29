import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import './append';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素内部的前面插入指定内容。支持传入多个参数
     * @param contents HTML 字符串、DOM 元素、DOM 元素数组、或 JQ 对象
     * @returns 原始集合
     * @example
```js
$('<p>I would like to say: </p>').prepend('<b>Hello</b>');
// <p><b>Hello</b>I would like to say: </p>
```
     * @example
```js
$('<p>I would like to say: </p>').prepend('<b>Hello</b>', '<b>World</b>');
// <p><b>Hello</b><b>World</b>I would like to say: </p>
```
     */
    prepend(
      ...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>
    ): this;

    /**
     * 在当前元素内部的前面插入指定内容
     * @param callback
     * 一个返回 HTML 字符串、DOM 元素、DOM 元素数组、或 JQ 对象的回调函数
     *
     * 函数的第一个参数为元素的索引位置，第二个参数为元素的旧的 HTML 值，`this` 指向当前元素
     * @returns 原始集合
     * @example
```js
$('<p>Hello</p>').append(function (index, html) {
  return '<b>' + html + index + '</b>';
});
// <p><b>Hello0</b>Hello</p>
```
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

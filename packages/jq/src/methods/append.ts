import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import { isFunction } from '../utils';
import './after';
import './before';
import './each';
import './remove';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素内部的后面插入指定内容
     * @param contents
     * @returns 原集合
     * @example
```js
$('<p>I would like to say: </p>').append('<b>Hello</b>');
// [ <p>I would like to say: <b>Hello</b></p> ]
```
     */
    append(...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>): this;

    /**
     * 在当前元素内部的后面插入指定内容
     * @param callback
     * @returns 原集合
     */
    append(
      callback: (
        this: T,
        index: number,
        html: string,
      ) => HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}

each(['prepend', 'append'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, ...args: any[]): JQ {
    return this.each((index, element) => {
      const childNodes = element.childNodes;
      const childLength = childNodes.length;

      const child = childLength
        ? childNodes[nameIndex ? childLength - 1 : 0]
        : document.createElement('div');

      if (!childLength) {
        element.append(child);
      }

      const contents = isFunction(args[0])
        ? [args[0].call(element, index, element.innerHTML)]
        : args;

      $(child)[nameIndex ? 'after' : 'before'](...contents);

      if (!childLength) {
        element.removeChild(child);
      }
    });
  };
});

import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import { getChildNodesArray, isFunction, isString } from '../utils';
import './each';
import './insertAfter';
import './insertBefore';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把指定元素插入到当前元素前面
     * @param contents
     * @returns 未插入元素之前的集合
     * @example
```js
$('<p>I would like to say: </p>').before('<b>Hello</b>')
// [ <b>Hello</b><p>I would like to say: </p> ]
```
     */
    before(...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>): this;

    /**
     * 把指定回调函数返回的元素插入到当前元素前面
     * @param callback
     * @returns 未插入元素之前的集合
     */
    before(
      callback: (
        this: T,
        index: number,
        oldHtml: string,
      ) => HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}

/**
 * 是否不是 HTML 字符串（包裹在 <> 中）
 * @param target
 */
function isPlainText(target: string): boolean {
  return (
    isString(target) && (target[0] !== '<' || target[target.length - 1] !== '>')
  );
}

each(['before', 'after'], (nameIndex, name) => {
  $.fn[name] = function(this: JQ, ...args: any[]): JQ {
    // after 方法，多个参数需要按参数顺序添加到元素后面，所以需要将参数顺序反向处理
    if (nameIndex === 1) {
      args = args.reverse();
    }

    return this.each((index, element) => {
      const targets = isFunction(args[0])
        ? [args[0].call(element, index, element.innerHTML)]
        : args;

      each(targets, (_, target) => {
        const $target = $(
          isPlainText(target) ? getChildNodesArray(target, 'div') : target,
        );

        $target[nameIndex ? 'insertAfter' : 'insertBefore'](element);
      });
    });
  };
});

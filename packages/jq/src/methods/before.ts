import { $ } from '../$.js';
import { getChildNodesArray } from '../shared/dom.js';
import {
  isFunction,
  isString,
  isElement,
  eachArray,
} from '../shared/helper.js';
import './each.js';
import './insertAfter.js';
import './insertBefore.js';
import type { JQ } from '../shared/core.js';
import type { HTMLString, TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素前面插入指定内容，作为其兄弟节点。支持传入多个参数。
     * @param contents HTML 字符串、DOM 元素、DOM 元素数组、或 JQ 对象
     * @returns 原始集合
     * @example
```js
$('<p>I would like to say: </p>').before('<b>Hello</b>')
// <b>Hello</b><p>I would like to say: </p>
```
     * @example
```js
$('<p>I would like to say: </p>').before('<b>Hello</b>', '<b>World</b>')
// <b>Hello</b><b>World</b><p>I would like to say: </p>
```
     */
    before(...contents: Array<HTMLString | TypeOrArray<Node> | JQ<Node>>): this;

    /**
     * 在当前元素前面插入指定内容，作为其兄弟节点
     * @param callback
     * 一个返回 HTML 字符串、DOM 元素、DOM 元素数组、或 JQ 对象的回调函数
     *
     * 函数的第一个参数为元素的索引位置，第二个参数为元素的旧的 HTML 值，`this` 指向当前元素
     * @returns 原始集合
     * @example
```js
$('<p>Hello</p>').before(function (index, html) {
  return '<b>' + html + index + '</b>';
});
// <b>Hello0</b><p>Hello</p>
```
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
const isPlainText = (target: string): boolean => {
  return isString(target) && !(target.startsWith('<') && target.endsWith('>'));
};

eachArray(['before', 'after'], (name, nameIndex) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $.fn[name as 'before'] = function (this: JQ, ...args: any[]): JQ {
    // after 方法，多个参数需要按参数顺序添加到元素后面，所以需要将参数顺序反向处理
    if (nameIndex === 1) {
      args = args.reverse();
    }

    return this.each((index, element) => {
      const targets = isFunction(args[0])
        ? [args[0].call(element, index, element.innerHTML)]
        : args;

      eachArray(targets, (target) => {
        let $target: JQ;

        if (isPlainText(target)) {
          $target = $(getChildNodesArray(target, 'div') as HTMLElement[]);
        } else if (index && isElement(target)) {
          $target = $(target.cloneNode(true) as HTMLElement);
        } else {
          $target = $(target);
        }

        $target[nameIndex ? 'insertAfter' : 'insertBefore'](element);
      });
    });
  };
});

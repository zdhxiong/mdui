import { $ } from '../$.js';
import { createElement, appendChild } from '../shared/dom.js';
import { eachArray } from '../shared/helper.js';
import './insertAfter.js';
import './insertBefore.js';
import './map.js';
import './remove.js';
import type { JQ } from '../shared/core.js';
import type { HTMLString, Selector, TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 把当前集合中的元素追加到指定元素内部的后面。
     * @param target CSS 选择器、HTML 字符串、DOM 元素、DOM 元素数组、或 JQ 对象
     * @returns 由新插入的元素组成的集合
     * @example
```js
$('<p>Hello</p>').appendTo('<p>I would like to say: </p>')
// <p>I would like to say: <p>Hello</p></p>
```
     */
    appendTo(target: Selector | HTMLString | TypeOrArray<Element> | JQ): this;
  }
}

eachArray(['appendTo', 'prependTo'], (name, nameIndex) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $.fn[name as 'appendTo'] = function (this: JQ, target: any): JQ {
    const extraChilds: HTMLElement[] = [];
    const $target = $(target).map((_, element: HTMLElement) => {
      const childNodes = element.childNodes;
      const childLength = childNodes.length;

      if (childLength) {
        return childNodes[nameIndex ? 0 : childLength - 1];
      }

      const child = createElement('div');
      appendChild(element, child);
      extraChilds.push(child);

      return child;
    });

    const $result = this[nameIndex ? 'insertBefore' : 'insertAfter']($target);

    $(extraChilds).remove();

    return $result;
  };
});

import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import { isDocument, isFunction, isString, isWindow } from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 如果集合中至少一个元素和参数匹配，则返回 `true`，否则返回 `false`
     * @param selector
     * 可以是 CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置、第二个参数为当前元素，`this` 指向当前元素
     *
     * 若回调函数返回 `true`，则表示和当前元素匹配；若返回 `false`，表示和当前元素不匹配
     * @example
```js
$('.box').is('.box') // true
$('.box').is('.boxss'); // false
```
     */
    is(
      selector:
        | Selector
        | TypeOrArray<Element>
        | JQ
        | ((this: T, index: number, element: T) => boolean),
    ): boolean;
  }
}

$.fn.is = function (this: JQ, selector: any): boolean {
  let isMatched = false;

  if (isFunction(selector)) {
    this.each((index, element) => {
      if (selector.call(element, index, element)) {
        isMatched = true;
      }
    });

    return isMatched;
  }

  if (isString(selector)) {
    this.each((_, element) => {
      if (isDocument(element) || isWindow(element)) {
        return;
      }

      // @ts-ignore
      const matches = element.matches || element.msMatchesSelector;

      if (matches.call(element, selector)) {
        isMatched = true;
      }
    });

    return isMatched;
  }

  const $compareWith = $(selector);

  this.each((_, element) => {
    $compareWith.each((_, compare) => {
      if (element === compare) {
        isMatched = true;
      }
    });
  });

  return isMatched;
};

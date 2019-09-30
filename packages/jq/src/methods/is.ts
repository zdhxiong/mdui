import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import { isFunction, isString } from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 根据选择器、DOM元素或 JQ 对象来检测匹配元素集合，
     * 如果其中至少有一个元素符合这个给定的表达式就返回 true
     * @param selector
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

$.fn.is = function(this: JQ, selector: any): boolean {
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

import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import {
  isArrayLike,
  isDocument,
  isElement,
  isNull,
  isString,
  isUndefined,
  isWindow,
} from '../utils';
import { JQ } from '../JQ';
import $ from '../$';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 根据选择器、DOM元素或 JQ 对象来检测匹配元素集合，
     * 如果其中至少有一个元素符合这个给定的表达式就返回true
     * @param selector
     * @example
```js
$('.box').is('.box') // true
$('.box').is('.boxss'); // false
```
     */
    is(selector: JQSelector): boolean;
  }
}

$.fn.is = function(this: JQ, selector: JQSelector): boolean {
  const self = this[0];

  if (!self || isUndefined(selector) || isNull(selector)) {
    return false;
  }

  // CSS 选择器
  if (isString(selector) && isElement(self)) {
    const matchesSelector =
      self.matches ||
      // @ts-ignore
      self.matchesSelector ||
      self.webkitMatchesSelector ||
      // @ts-ignore
      self.mozMatchesSelector ||
      // @ts-ignore
      self.oMatchesSelector ||
      // @ts-ignore
      self.msMatchesSelector;

    return matchesSelector.call(self, selector);
  }

  if (isDocument(selector) || isWindow(selector)) {
    return self === selector;
  }

  if (selector instanceof Node || isArrayLike(selector)) {
    const $compareWith = selector instanceof Node ? [selector] : selector;

    for (let i = 0; i < $compareWith.length; i += 1) {
      if ($compareWith[i] === self) {
        return true;
      }
    }
  }

  return false;
};

import $ from '../$';
import { isArrayLike, isString } from '../utils';

/**
 * 根据选择器、DOM元素或 JQ 对象来检测匹配元素集合，
 * 如果其中至少有一个元素符合这个给定的表达式就返回true
 * @param selector {String|Node|NodeList|Array|JQ|Window}
 * @returns boolean
 */
$.fn.is = function (selector) {
  const self = this[0];

  if (!self || selector === undefined || selector === null) {
    return false;
  }

  if (isString(selector)) {
    if (self === document || self === window) {
      return false;
    }

    const matchesSelector = self.matches
      || self.matchesSelector
      || self.webkitMatchesSelector
      || self.mozMatchesSelector
      || self.oMatchesSelector
      || self.msMatchesSelector;

    return matchesSelector.call(self, selector);
  }

  if (selector === document || selector === window) {
    return self === selector;
  }

  if (selector.nodeType || isArrayLike(selector)) {
    const $compareWith = selector.nodeType ? [selector] : selector;

    for (let i = 0; i < $compareWith.length; i += 1) {
      if ($compareWith[i] === self) {
        return true;
      }
    }

    return false;
  }

  return false;
};

import $ from '../$';
import { isFunction } from '../utils';
import './map';

/**
 * 筛选元素集合
 * @param selector {String|JQ|Node|Function}
 * @returns {JQ}
 */
$.fn.filter = function (selector) {
  if (isFunction(selector)) {
    return this.map((index, ele) => (selector.call(ele, index, ele) ? ele : undefined));
  }

  const $selector = $(selector);

  return this.map((index, ele) => ($selector.index(ele) > -1 ? ele : undefined));
};

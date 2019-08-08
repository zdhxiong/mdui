import $ from '../$';
import './map';
import './filter';

/**
 * 从元素集合中删除指定的元素
 * @param selector {String|Node|JQ|Function}
 * @return {JQ}
 */
$.fn.not = function (selector) {
  const $excludes = this.filter(selector);

  return this.map((index, ele) => ($excludes.index(ele) > -1 ? undefined : ele));
};

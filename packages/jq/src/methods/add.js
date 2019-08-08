import JQ from '../JQ';
import $ from '../$';
import unique from '../functions/unique';
import merge from '../functions/merge';
import './get';

/**
 * 添加匹配的元素到当前对象中
 * @param selector {String|JQ}
 * @returns {JQ}
 */
$.fn.add = function (selector) {
  return new JQ(unique(merge(this.get(), $(selector))));
};

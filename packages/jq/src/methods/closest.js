import $ from '../$';
import './parents';
import './eq';
import './is';

/**
 * 返回首先匹配到的父节点，包含父节点
 * @param selector {String}
 * @returns {JQ}
 */
$.fn.closest = function (selector) {
  let self = this;

  if (!self.is(selector)) {
    self = self.parents(selector).eq(0);
  }

  return self;
};

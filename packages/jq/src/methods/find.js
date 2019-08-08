import JQ from '../JQ';
import $ from '../$';
import merge from '../functions/merge';
import './each';

/**
 * 根据 CSS 选择器找到后代节点的集合
 * @param selector {String}
 * @returns {JQ}
 */
$.fn.find = function (selector) {
  const foundElements = [];

  this.each((i, _this) => {
    const { nodeType } = _this;

    if (nodeType !== 1 && nodeType !== 9) {
      // 不是 element 和 document 则跳过
      return;
    }

    merge(foundElements, _this.querySelectorAll(selector));
  });

  return new JQ(foundElements);
};

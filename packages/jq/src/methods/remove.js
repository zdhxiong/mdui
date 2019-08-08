import $ from '../$';
import './each';

/**
 * 删除所有匹配的元素
 * @returns {JQ}
 */
$.fn.remove = function () {
  return this.each((i, _this) => {
    if (_this.parentNode) {
      _this.parentNode.removeChild(_this);
    }
  });
};

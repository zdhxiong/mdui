import $ from '../$';

/**
 * 获取元素相对于 document 的偏移
 * @returns {Object}
 */
$.fn.offset = function () {
  if (this[0]) {
    const offset = this[0].getBoundingClientRect();

    return {
      left: offset.left + window.pageXOffset,
      top: offset.top + window.pageYOffset,
      width: offset.width,
      height: offset.height,
    };
  }

  return null;
};

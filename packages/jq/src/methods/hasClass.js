import $ from '../$';

/**
 * 是否含有指定的 CSS 类
 * @param className {String}
 * @returns {boolean}
 */
$.fn.hasClass = function (className) {
  if (!this[0] || !className) {
    return false;
  }

  return this[0].classList.contains(className);
};

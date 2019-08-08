import $ from '../$';
import './map';
import './css';

/**
 * 返回最近的用于定位的父元素
 * @returns {*|JQ}
 */
$.fn.offsetParent = function () {
  return this.map(function () {
    let parent = this.offsetParent;

    while (parent && $(parent).css('position') === 'static') {
      parent = parent.offsetParent;
    }

    return parent || document.documentElement;
  });
};

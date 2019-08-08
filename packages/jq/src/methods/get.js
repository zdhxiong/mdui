import $ from '../$';

/**
 * 获取指定 DOM 元素，没有 index 参数时，获取所有 DOM 的数组
 */
$.fn.get = function (index) {
  return index === undefined
    ? [].slice.call(this)
    : this[index >= 0 ? index : index + this.length];
};

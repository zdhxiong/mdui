import JQ from '../JQ';
import $ from '../$';
import './slice';

/**
 * 获取当前对象中第n个元素
 * @param index {Number}
 * @returns {JQ}
 */
$.fn.eq = function (index) {
  const ret = index === -1
    ? this.slice(index)
    : this.slice(index, +index + 1);

  return new JQ(ret);
};

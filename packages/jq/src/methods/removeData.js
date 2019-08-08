import $ from '../$';
import removeData from '../functions/removeData';
import './each';

/**
 * 移除元素上存储的数据
 * @param key 必须
 * @returns {*}
 */
$.fn.removeData = function (key) {
  return this.each((i, elem) => {
    removeData(elem, key);
  });
};

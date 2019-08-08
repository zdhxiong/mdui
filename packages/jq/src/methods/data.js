import $ from '../$';
import { isObjectLike } from '../utils';
import data from '../functions/data';
import './each';

/**
 * 在元素上读取或设置数据
 * @param key 必须
 * @param value
 * @returns {*}
 */
$.fn.data = function (key, value) {
  if (value === undefined) {
    if (isObjectLike(key)) {
      // 同时设置多个值
      return this.each((i, elem) => {
        data(elem, key);
      });
    }

    if (this[0]) {
      // 获取值
      return data(this[0], key);
    }

    return undefined;
  }

  // 设置值
  return this.each((i, elem) => {
    data(elem, key, value);
  });
};

import $ from '../$';
import each from '../functions/each';
import './serializeArray';

/**
 * 将表单元素或对象序列化
 * @returns {String}
 */
$.fn.serialize = function () {
  const result = [];

  each(this.serializeArray(), (i, elem) => {
    result.push(`${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}`);
  });

  return result.join('&');
};

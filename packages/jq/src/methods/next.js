import $ from '../$';
import each from '../functions/each';
import dir from './utils/dir';

/**
 * next - 取得后一个匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * nextAll - 取得后面所有匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * nextUntil - 取得后面所有匹配的元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`next${name}`] = function (selector) {
    return dir(this, selector, nameIndex, 'nextElementSibling');
  };
});

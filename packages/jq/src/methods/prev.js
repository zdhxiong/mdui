import $ from '../$';
import each from '../functions/each';
import dir from './utils/dir';
import './get';

/**
 * prev - 取得前一个匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * prevAll - 取得前面所有匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * prevUntil - 取得前面的所有元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`prev${name}`] = function (selector) {
    // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
    const $nodes = nameIndex === 0 ? this : $(this.get().reverse());

    return dir($nodes, selector, nameIndex, 'previousElementSibling');
  };
});

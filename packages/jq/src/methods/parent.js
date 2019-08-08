import $ from '../$';
import each from '../functions/each';
import dir from './utils/dir';
import './get';

/**
 * parent - 取得匹配的直接父元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * parents - 取得所有匹配的父元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * parentUntil - 取得所有的父元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 's', 'sUntil'], (nameIndex, name) => {
  $.fn[`parent${name}`] = function (selector) {
    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    const $nodes = nameIndex === 0 ? this : $(this.get().reverse());

    return dir($nodes, selector, nameIndex, 'parentNode');
  };
});

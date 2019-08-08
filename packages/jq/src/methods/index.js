import $ from '../$';
import { isString } from '../utils';
import './eq';
import './parent';
import './children';
import './get';

/**
 * 获取一个元素的位置。
 * 当 elem 参数没有给出时，返回当前元素在兄弟节点中的位置。
 * 有给出了 elem 参数时，返回 elem 元素在当前对象中的位置
 * @param elem {selector|Node=}
 * @returns {Number}
 */
$.fn.index = function (elem) {
  if (!elem) {
    // 获取当前 JQ 对象的第一个元素在同辈元素中的位置
    return this
      .eq(0)
      .parent()
      .children()
      .get()
      .indexOf(this[0]);
  }

  if (isString(elem)) {
    // 返回当前 JQ 对象的第一个元素在指定选择器对应的元素中的位置
    return $(elem)
      .eq(0)
      .parent()
      .children()
      .get()
      .indexOf(this[0]);
  }

  // 返回指定元素在当前 JQ 对象中的位置
  return this
    .get()
    .indexOf(elem);
};

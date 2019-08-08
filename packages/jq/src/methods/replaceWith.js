import $ from '../$';
import './before';
import './remove';

/**
 * 用新元素替换当前元素
 * @param newContent {String|Node|NodeList|JQ}
 * @returns {JQ}
 */
$.fn.replaceWith = function (newContent) {
  return this.before(newContent).remove();
};

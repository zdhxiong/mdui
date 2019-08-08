import $ from '../$';
import each from '../functions/each';
import './each';

/**
 * val - 获取或设置元素的值
 * @param value {String=}
 * @return {*|JQ}
 */
/**
 * html - 获取或设置元素的 HTML
 * @param value {String=}
 * @return {*|JQ}
 */
/**
 * text - 获取或设置元素的内容
 * @param value {String=}
 * @return {*|JQ}
 */
each(['val', 'html', 'text'], (nameIndex, name) => {
  const props = {
    0: 'value',
    1: 'innerHTML',
    2: 'textContent',
  };

  const defaults = {
    0: undefined,
    1: undefined,
    2: null,
  };

  $.fn[name] = function (value) {
    if (value === undefined) {
      // 获取值
      return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
    }

    // 设置值
    return this.each((i, elem) => {
      elem[props[nameIndex]] = value;
    });
  };
});

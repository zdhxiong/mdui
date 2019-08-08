import $ from '../$';
import { isString } from '../utils';
import each from '../functions/each';
import './each';

/**
 * attr - 获取或设置元素的属性值
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
/**
 * prop - 获取或设置元素的属性值
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
/**
 * css - 获取或设置元素的样式
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
each(['attr', 'prop', 'css'], (nameIndex, name) => {
  function set(elem, key, value) {
    if (nameIndex === 0) {
      elem.setAttribute(key, value);
    } else if (nameIndex === 1) {
      elem[key] = value;
    } else {
      elem.style[key] = value;
    }
  }

  function get(elem, key) {
    if (!elem) {
      return undefined;
    }

    if (nameIndex === 0) {
      return elem.getAttribute(key);
    }

    if (nameIndex === 1) {
      return elem[key];
    }

    return window.getComputedStyle(elem, null).getPropertyValue(key);
  }

  $.fn[name] = function (key, value) {
    const argLength = arguments.length;

    if (argLength === 1 && isString(key)) {
      // 获取值
      return get(this[0], key);
    }

    // 设置值
    return this.each((i, elem) => {
      if (argLength === 2) {
        set(elem, key, value);
      } else {
        each(key, (k, v) => {
          set(elem, k, v);
        });
      }
    });
  };
});

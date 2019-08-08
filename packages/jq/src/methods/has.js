import $ from '../$';
import { isString } from '../utils';
import contains from '../functions/contains';
import './filter';
import './find';

/**
 * 保留含有指定子元素的元素，去掉不含有指定子元素的元素
 * @param selector {String|Node|JQ|NodeList|Array}
 * @return {JQ}
 */
$.fn.has = function (selector) {
  const $targets = isString(selector) ? this.find(selector) : $(selector);
  const { length } = $targets;

  return this.filter(function () {
    for (let i = 0; i < length; i += 1) {
      if (contains(this, $targets[i])) {
        return true;
      }
    }

    return false;
  });
};

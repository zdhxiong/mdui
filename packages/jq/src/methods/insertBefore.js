import $ from '../$';
import each from '../functions/each';
import './each';

/**
 * insertBefore - 插入到指定元素的前面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * insertAfter - 插入到指定元素的后面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
  $.fn[name] = function (selector) {
    const $elem = $(selector);

    return this.each((i, _this) => {
      $elem.each((j, elem) => {
        elem.parentNode.insertBefore(
          $elem.length === 1 ? _this : _this.cloneNode(true),
          nameIndex === 0 ? elem : elem.nextSibling,
        );
      });
    });
  };
});

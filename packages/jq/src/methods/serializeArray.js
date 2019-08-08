import $ from '../$';
import './each';
import './attr';
import './val';

/**
 * 将表单元素的值组合成键值对数组
 * @returns {Array}
 */
$.fn.serializeArray = function () {
  const result = [];
  const elem = this[0];

  if (!elem || !elem.elements) {
    return result;
  }

  $([].slice.call(elem.elements)).each(function () {
    const $elem = $(this);
    const type = $elem.attr('type');
    if (
      this.nodeName.toLowerCase() !== 'fieldset'
      && !this.disabled
      && ['submit', 'reset', 'button'].indexOf(type) === -1
      && (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
    ) {
      result.push({
        name: $elem.attr('name'),
        value: $elem.val(),
      });
    }
  });

  return result;
};

import $ from '../$';
import each from '../functions/each';
import './css';

/**
 * innerWidth - 获取元素的宽度，包含内边距
 * @return {Number}
 */
/**
 * innerHeight - 获取元素的高度，包含内边距
 * @return {Number}
 */
each({
  Width: 'width',
  Height: 'height',
}, (prop, name) => {
  $.fn[`inner${prop}`] = function () {
    let value = this[name]();
    const $elem = $(this[0]);

    if ($elem.css('box-sizing') !== 'border-box') {
      value += parseFloat($elem.css(`padding-${name === 'width' ? 'left' : 'top'}`));
      value += parseFloat($elem.css(`padding-${name === 'width' ? 'right' : 'bottom'}`));
    }

    return value;
  };
});

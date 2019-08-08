import $ from '../$';
import { isWindow, isDocument } from '../utils';
import each from '../functions/each';
import './css';

/**
 * width - 获取元素的宽度
 * @return {Number}
 */
/**
 * height - 获取元素的高度
 * @return {Number}
 */
each({
  Width: 'width',
  Height: 'height',
}, (prop, name) => {
  $.fn[name] = function (val) {
    if (val === undefined) {
      // 获取
      const elem = this[0];

      if (isWindow(elem)) {
        return elem[`inner${prop}`];
      }

      if (isDocument(elem)) {
        return elem.documentElement[`scroll${prop}`];
      }

      const $elem = $(elem);

      // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
      let IEFixValue = 0;
      const isWidth = name === 'width';
      if ('ActiveXObject' in window) { // 判断是 IE 浏览器
        if ($elem.css('box-sizing') === 'border-box') {
          IEFixValue = parseFloat($elem.css(`padding-${isWidth ? 'left' : 'top'}`))
            + parseFloat($elem.css(`padding-${(isWidth ? 'right' : 'bottom')}`))
            + parseFloat($elem.css(`border-${isWidth ? 'left' : 'top'}-width`))
            + parseFloat($elem.css(`border-${isWidth ? 'right' : 'bottom'}-width`));
        }
      }

      return parseFloat($(elem).css(name)) + IEFixValue;
    }

    // 设置
    /* eslint no-restricted-globals: 0 */
    if (!isNaN(Number(val)) && val !== '') {
      val += 'px';
    }

    return this.css(name, val);
  };
});

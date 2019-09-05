import JQElement from '../types/JQElement';
import { isWindow, isDocument, isUndefined } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './css';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置对象中所有元素的宽度。参数是数字或数字字符串时，自动添加 px 作为单位
     * @param value
     * @example
```js
$('.box').width('20%')
```
     @example
```js
$('.box').width(10);
```
     */
    width(value: string | number): this;

    /**
     * 获取第一个元素的宽度
     * @example
```js
$('.box').width();
```
     */
    width(): number;
  }
}

each(
  {
    Width: 'width',
    Height: 'height',
  },
  (prop, name) => {
    $.fn[name] = function(this: JQ, value?: string | number): JQ | number {
      // 获取值
      if (isUndefined(value)) {
        const element = this[0];

        if (isWindow(element)) {
          // @ts-ignore
          return element[`inner${prop}`];
        }

        if (isDocument(element)) {
          // @ts-ignore
          return element.documentElement[`scroll${prop}`];
        }

        const $element = $(element);

        // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
        let IEFixValue = 0;
        const isWidth = name === 'width';

        // 判断是 IE 浏览器
        if ('ActiveXObject' in window) {
          if ($element.css('box-sizing') === 'border-box') {
            const directionLeft = isWidth ? 'left' : 'top';
            const directionRight = isWidth ? 'right' : 'bottom';
            const propertyNames = [
              `padding-${directionLeft}`,
              `padding-${directionRight}`,
              `border-${directionLeft}-width`,
              `border-${directionRight}-width`,
            ];

            each(propertyNames, (_, property) => {
              IEFixValue += parseFloat($element.css(property) || '0');
            });
          }
        }

        return parseFloat($(element).css(name) || '0') + IEFixValue;
      }

      // 设置值
      if (!isNaN(Number(value)) && value !== '') {
        value += 'px';
      }

      return this.css(name, value);
    };
  },
);

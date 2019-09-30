import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import './css';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取元素的宽度，包含内边距
     * @example
```js
$('.box').innerWidth()
```
     */
    innerWidth(): number;
  }
}

each(
  {
    Width: 'width',
    Height: 'height',
  },
  (prop, name) => {
    $.fn[`inner${prop}`] = function(this: JQ): number {
      let value = this[name as 'width' | 'height']();
      const $element = $(this[0]);

      if ($element.css('box-sizing') !== 'border-box') {
        const isWidth = name === 'width';
        const directionLeft = isWidth ? 'left' : 'top';
        const directionRight = isWidth ? 'right' : 'bottom';
        const propertyNames = [
          `padding-${directionLeft}`,
          `padding-${directionRight}`,
        ];

        each(propertyNames, (_, property) => {
          value += parseFloat($element.css(property) || '0');
        });
      }

      return value;
    };
  },
);

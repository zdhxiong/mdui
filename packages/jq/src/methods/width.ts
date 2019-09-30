import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import {
  isDocument,
  isFunction,
  isNull,
  isUndefined,
  isWindow,
  toElement,
} from '../utils';
import './css';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
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
    width(
      value:
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldValue: number,
          ) => string | number | null | undefined | void),
    ): this;

    /**
     * 获取第一个元素的宽度（像素值），不包含 padding, border, margin 的宽度
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
    function get(element: Element): number {
      const clientPropName = `client${prop}` as 'clientWidth' | 'clientHeight';
      const scrollPropName = `scroll${prop}` as 'scrollWidth' | 'scrollHeight';
      const offsetPropName = `offset${prop}` as 'offsetWidth' | 'offsetHeight';

      if (isWindow(element)) {
        return toElement(document)[clientPropName];
      }

      if (isDocument(element)) {
        const doc = toElement(element) as HTMLElement;

        return Math.max(
          element.body[scrollPropName],
          doc[scrollPropName],
          element.body[offsetPropName],
          doc[offsetPropName],
          doc[clientPropName],
        );
      }

      return parseFloat($(element).css(name) || '0');
    }

    $.fn[name] = function(this: JQ, value?: any): JQ | number | undefined {
      // 获取第一个元素的值
      if (!arguments.length) {
        if (!this.length) {
          return undefined;
        }

        return get(this[0]);
      }

      // 设置每个元素的值
      return this.each((index, element) => {
        let computedValue = isFunction(value)
          ? value.call(element, index, get(element))
          : value;

        if (isNull(computedValue) || isUndefined(computedValue)) {
          return;
        }

        if (!isNaN(Number(computedValue)) && computedValue !== '') {
          computedValue += 'px';
        }

        $(element).css(name, computedValue);
      });
    };
  },
);

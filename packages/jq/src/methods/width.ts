import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import { isDocument, isFunction, isWindow, toElement } from '../utils';
import './css';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的宽度
     * @param value
     * 可以是带单位的字符串，或者数值；或者是返回带单位的字符串或数值的回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的宽度值，`this` 指向当前元素
     *
     * 若该值、或函数返回值是数值，则自动添加 `px` 作为单位
     *
     * 若该值、或函数返回值是 `null` 或 `undefined`，则不修改元素的宽度
     * @example
```js
$('.box').width('20%')
```
     * @example
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
     * 获取集合中第一个元素的宽度（像素值），不包含 padding, border, margin 的宽度
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

        if (computedValue == null) {
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

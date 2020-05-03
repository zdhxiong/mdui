import $ from '../$';
import extend from '../functions/extend';
import { JQ } from '../JQ';
import { isFunction } from '../utils';
import './css';
import './each';
import './position';

/**
 * 获取坐标的返回值，left 和 top 都存在
 */
interface CoordinatesValue {
  left: number;
  top: number;
}

/**
 * 设置坐标时，left 和 top 都是可选的
 */
interface CoordinatesParam {
  left?: number;
  top?: number;
}

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素相对于 `document` 的坐标
     * @param value
     * 包含 `top` 和 `left` 属性的对象；或返回此对象的回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素的当前坐标，`this`指向当前元素
     *
     * `top`, `left` 的值为 `undefined` 时，不修改对应的值。
     * @example
```js
$('.box').offset({ top: 20, left: 30 });
```
     * @example
```js
$('.box').offset(function () {
  return { top: 20, left: 30 };
});
```
     */
    offset(
      value:
        | CoordinatesParam
        | ((
            this: T,
            index: number,
            oldOffset: CoordinatesValue,
          ) => CoordinatesParam),
    ): this;

    /**
     * 获取当前集合中第一个元素相对于 `document` 的坐标
     * @example
```js
$('.box').offset();
// { top: 20, left: 30 }
```
     */
    offset(): CoordinatesValue;
  }
}

function get(element: Element): CoordinatesValue {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = element.getBoundingClientRect();
  const win = (element.ownerDocument as Document).defaultView as Window;

  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

function set(element: Element, value: CoordinatesParam, index: number): void {
  const $element = $(element);
  const position = $element.css('position');

  if (position === 'static') {
    $element.css('position', 'relative');
  }

  const currentOffset = get(element);
  const currentTopString = $element.css('top');
  const currentLeftString = $element.css('left');
  let currentTop: number;
  let currentLeft: number;

  const calculatePosition =
    (position === 'absolute' || position === 'fixed') &&
    (currentTopString + currentLeftString).indexOf('auto') > -1;

  if (calculatePosition) {
    const currentPosition = $element.position();
    currentTop = currentPosition.top;
    currentLeft = currentPosition.left;
  } else {
    currentTop = parseFloat(currentTopString);
    currentLeft = parseFloat(currentLeftString);
  }

  const computedValue = isFunction(value)
    ? value.call(element, index, extend({}, currentOffset))
    : value;

  $element.css({
    top:
      computedValue.top != null
        ? computedValue.top - currentOffset.top + currentTop
        : undefined,
    left:
      computedValue.left != null
        ? computedValue.left - currentOffset.left + currentLeft
        : undefined,
  });
}

$.fn.offset = function (this: JQ, value?: any): any {
  // 获取坐标
  if (!arguments.length) {
    if (!this.length) {
      return undefined;
    }

    return get(this[0]);
  }

  // 设置坐标
  return this.each(function (index) {
    set(this, value, index);
  });
};

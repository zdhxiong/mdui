import { $ } from '../$.js';
import { extend } from '../functions/extend.js';
import { isFunction } from '../shared/helper.js';
import './css.js';
import './each.js';
import './position.js';
import type { JQ } from '../shared/core.js';
import type { PlainObject } from '../shared/helper.js';

/**
 * 坐标值
 */
interface Coordinates extends PlainObject {
  left: number;
  top: number;
}

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素相对于 `document` 的坐标。
     * @param value
     * 包含 `top` 和 `left` 属性的对象；或返回此对象的回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素的原有坐标，`this`指向当前元素
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
        | Partial<Coordinates>
        | ((
            this: T,
            index: number,
            oldOffset: Coordinates,
          ) => Partial<Coordinates>),
    ): this;

    /**
     * 获取当前集合中第一个元素相对于 `document` 的坐标
     * @example
```js
$('.box').offset();
// { top: 20, left: 30 }
```
     */
    offset(): Coordinates;
  }
}

const get = (element: Element): Coordinates => {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const { top, left } = element.getBoundingClientRect();
  const { pageYOffset, pageXOffset } = element.ownerDocument
    .defaultView as Window;

  return {
    top: top + pageYOffset,
    left: left + pageXOffset,
  };
};

const set = (
  element: Element,
  value: Partial<Coordinates>,
  index: number,
): void => {
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
    (currentTopString + currentLeftString).includes('auto');

  if (calculatePosition) {
    const currentPosition = $element.position();
    currentTop = currentPosition.top;
    currentLeft = currentPosition.left;
  } else {
    currentTop = parseFloat(currentTopString);
    currentLeft = parseFloat(currentLeftString);
  }

  const computedValue: Coordinates = isFunction(value)
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

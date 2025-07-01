import { getDocument } from 'ssr-window';
import { $ } from '../$.js';
import {
  isBorderBox,
  getExtraWidth,
  getComputedStyleValue,
} from '../shared/css.js';
import {
  isBoolean,
  isString,
  isDocument,
  isFunction,
  isWindow,
  toElement,
  eachArray,
} from '../shared/helper.js';
import './css.js';
import './each.js';
import type { JQ } from '../shared/core.js';

type Value = string | number | null | undefined;

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的宽度（不包含 `padding`, `border`, `margin` 的宽度）。
     * @param value
     * 可以是带单位的字符串，或者数值；或者是返回带单位的字符串或数值的回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的宽度值，`this` 指向当前元素。
     *
     * 若该值、或函数返回值是数值，则自动添加 `px` 作为单位。
     *
     * 若该值、或函数返回值是 `null` 或 `undefined`，则不修改元素的宽度。
     * @example
```js
$('.box').width('20%');
```
     * @example
```js
$('.box').width(10);
```
     */
    width(
      value:
        | Value
        | ((this: T, index: number, oldValue: number) => Value | void),
    ): this;

    /**
     * 获取集合中第一个元素的宽度（像素值），不包含 `padding`, `border`, `margin` 的宽度
     * @example
```js
$('.box').width();
```
     */
    width(): number;
  }
}

type typeName = 'Width' | 'Height';
type typeExtra = 'margin' | 'padding' | 'border';

/**
 * 值上面的 padding、border、margin 处理
 * @param element
 * @param name
 * @param value
 * @param funcIndex
 * @param includeMargin
 * @param multiply
 */
const handleExtraWidth = (
  element: HTMLElement,
  name: typeName,
  value: number,
  funcIndex: number,
  includeMargin: boolean,
  multiply: number, // 值乘以多少
): number => {
  // 获取元素的 padding, border, margin 宽度（两侧宽度的和）
  const getExtraWidthValue = (extra: typeExtra): number => {
    return (
      getExtraWidth(element, name.toLowerCase() as 'width' | 'height', extra) *
      multiply
    );
  };

  if (funcIndex === 2 && includeMargin) {
    value += getExtraWidthValue('margin');
  }

  if (isBorderBox(element)) {
    if (funcIndex === 0) {
      value -= getExtraWidthValue('border');
    }

    if (funcIndex === 1) {
      value -= getExtraWidthValue('border');
      value -= getExtraWidthValue('padding');
    }
  } else {
    if (funcIndex === 0) {
      value += getExtraWidthValue('padding');
    }

    if (funcIndex === 2) {
      value += getExtraWidthValue('border');
      value += getExtraWidthValue('padding');
    }
  }

  return value;
};

/**
 * 获取元素的样式值
 * @param element
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 */
const get = (
  element: HTMLElement,
  name: typeName,
  funcIndex: number,
  includeMargin: boolean,
): number => {
  const document = getDocument();
  const clientProp = `client${name}` as 'clientWidth' | 'clientHeight';
  const scrollProp = `scroll${name}` as 'scrollWidth' | 'scrollHeight';
  const offsetProp = `offset${name}` as 'offsetWidth' | 'offsetHeight';
  const innerProp = `inner${name}` as 'innerWidth' | 'innerHeight';

  // $(window).width()
  if (isWindow(element)) {
    // outerWidth, outerHeight 需要包含滚动条的宽度
    return funcIndex === 2
      ? element[innerProp]
      : toElement(document)[clientProp];
  }

  // $(document).width()
  if (isDocument(element)) {
    const doc = toElement(element) as HTMLElement;

    return Math.max(
      // @ts-ignore
      element.body[scrollProp],
      doc[scrollProp],
      // @ts-ignore
      element.body[offsetProp],
      doc[offsetProp],
      doc[clientProp],
    );
  }

  const value = parseFloat(
    getComputedStyleValue(element, name.toLowerCase()) || '0',
  );

  return handleExtraWidth(element, name, value, funcIndex, includeMargin, 1);
};

/**
 * 设置元素的样式值
 * @param element
 * @param elementIndex
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 * @param value
 */
const set = (
  element: HTMLElement,
  elementIndex: number,
  name: typeName,
  funcIndex: number,
  includeMargin: boolean,
  value: string | number,
): void => {
  let computedValue: string | number = isFunction(value)
    ? value.call(
        element,
        elementIndex,
        get(element, name, funcIndex, includeMargin),
      )
    : value;

  if (computedValue == null) {
    return;
  }

  const $element = $(element);
  const dimension = name.toLowerCase();

  // 特殊的值，不需要计算 padding、border、margin
  if (
    isString(computedValue) &&
    ['auto', 'inherit', ''].includes(computedValue)
  ) {
    $element.css(dimension, computedValue);
    return;
  }

  // 其他值保留原始单位。注意：如果不使用 px 作为单位，则算出的值一般是不准确的
  const suffix = computedValue.toString().replace(/\b[0-9.]*/, '');
  const numerical = parseFloat(computedValue as string);

  computedValue =
    handleExtraWidth(element, name, numerical, funcIndex, includeMargin, -1) +
    (suffix || 'px');

  $element.css(dimension, computedValue);
};

eachArray<typeName>(['Width', 'Height'], (name) => {
  eachArray(
    [`inner${name}`, name.toLowerCase(), `outer${name}`],
    (funcName, funcIndex) => {
      $.fn[funcName as 'width'] = function (
        this: JQ,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        margin?: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value?: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ): any {
        // 是否是赋值操作
        const isSet = arguments.length && (funcIndex < 2 || !isBoolean(margin));
        const includeMargin = margin === true || value === true;

        // 获取第一个元素的值
        if (!isSet) {
          return this.length
            ? get(this[0], name, funcIndex, includeMargin)
            : undefined;
        }

        // 设置每个元素的值
        return this.each((index, element) => {
          return set(element, index, name, funcIndex, includeMargin, margin);
        });
      };
    },
  );
});

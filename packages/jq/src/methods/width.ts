import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import {
  isBoolean,
  isDocument,
  isFunction,
  isWindow,
  toElement,
  isBorderBox,
  getExtraWidth,
  getComputedStyleValue,
  isIE,
} from '../utils';
import './css';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的宽度（不包含 `padding`, `border`, `margin` 的宽度）
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
$('.box').width('20%');
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
type typeFuncIndex = 0 | 1 | 2;
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
function handleExtraWidth(
  element: HTMLElement,
  name: typeName,
  value: number,
  funcIndex: typeFuncIndex,
  includeMargin: boolean,
  multiply: number, // 值乘以多少
): number {
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
    // IE 为 box-sizing: border-box 时，得到的值不含 border 和 padding，这里先修复
    // 仅获取时需要处理，multiply === 1 为 get
    if (isIE() && multiply === 1) {
      value += getExtraWidthValue('border');
      value += getExtraWidthValue('padding');
    }

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
}

/**
 * 获取元素的样式值
 * @param element
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 */
function get(
  element: HTMLElement,
  name: typeName,
  funcIndex: typeFuncIndex,
  includeMargin: boolean,
): number {
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
}

/**
 * 设置元素的样式值
 * @param element
 * @param elementIndex
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 * @param value
 */
function set(
  element: HTMLElement,
  elementIndex: number,
  name: typeName,
  funcIndex: typeFuncIndex,
  includeMargin: boolean,
  value: string | number,
): void {
  let computedValue = isFunction(value)
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
  if (['auto', 'inherit', ''].indexOf(computedValue) > -1) {
    $element.css(dimension, computedValue);
    return;
  }

  // 其他值保留原始单位。注意：如果不使用 px 作为单位，则算出的值一般是不准确的
  const suffix = computedValue.toString().replace(/\b[0-9.]*/, '');
  const numerical = parseFloat(computedValue);

  computedValue =
    handleExtraWidth(element, name, numerical, funcIndex, includeMargin, -1) +
    (suffix || 'px');

  $element.css(dimension, computedValue);
}

each(['Width', 'Height'], (_, name: typeName) => {
  each(
    [`inner${name}`, name.toLowerCase(), `outer${name}`],
    (funcIndex: typeFuncIndex, funcName) => {
      $.fn[funcName] = function (
        this: JQ,
        margin?: any,
        value?: any,
      ): JQ | number | undefined {
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
        return this.each((index, element) =>
          set(element, index, name, funcIndex, includeMargin, margin),
        );
      };
    },
  );
});

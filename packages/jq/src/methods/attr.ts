import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import {
  cssNumber,
  getComputedStyleValue,
  isElement,
  isFunction,
  isNull,
  isNumber,
  isObjectLike,
  isUndefined,
  toCamelCase,
} from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置元素的属性
     * 如果为 null，则删除指定属性
     * 如果值为 void 或 undefined，则不修改当前属性
     * @param name
     * @param value
     * @example ````设置属性值
```js
$('div').attr('title', 'mdui');
```
     * @example ````通过函数返回值设置属性值
```js
$('img').attr('src', function() {
  return '/resources/' + this.title;
});
```
     */
    attr(
      name: string,
      value:
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldAttrValue: string,
          ) => string | number | null | void | undefined),
    ): this;

    /**
     * 同时设置多个属性
     * @param attributes
     * @example
```js
$('img').attr({
  src: '/resources/hat.gif',
  title: 'mdui',
  alt: 'mdui Logo'
});
```
     @example
```js
$('img').attr({
  src: function () {
    return '/resources/' + this.title;
  },
  title: 'mdui',
  alt: 'mdui Logo'
});
```
     */
    attr(
      attributes: PlainObject<
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldAttrValue: string,
          ) => string | number | null | void | undefined)
      >,
    ): this;

    /**
     * 获取第一个元素的属性值
     * @param name
     * @example
```js
$('div').attr('title');
```
     */
    attr(name: string): string | undefined;
  }
}

each(['attr', 'prop', 'css'], (nameIndex, name) => {
  function set(element: HTMLElement, key: string, value: any): void {
    // 值为 undefined 时，不修改
    if (isUndefined(value)) {
      return;
    }

    switch (nameIndex) {
      // attr
      case 0:
        if (isNull(value)) {
          element.removeAttribute(key);
        } else {
          element.setAttribute(key, value);
        }
        break;

      // prop
      case 1:
        // @ts-ignore
        element[key] = value;
        break;

      // css
      default:
        key = toCamelCase(key);

        // @ts-ignore
        element.style[key] = isNumber(value)
          ? `${value}${cssNumber.indexOf(key) > -1 ? '' : 'px'}`
          : value;
        break;
    }
  }

  function get(element: HTMLElement, key: string): any {
    switch (nameIndex) {
      // attr
      case 0:
        // 属性不存在时，原生 getAttribute 方法返回 null，而 jquery 返回 undefined。这里和 jquery 保持一致
        const value = element.getAttribute(key);
        return isNull(value) ? undefined : value;

      // prop
      case 1:
        // @ts-ignore
        return element[key];

      // css
      default:
        return getComputedStyleValue(element, key);
    }
  }

  $.fn[name] = function(this: JQ, key: string | PlainObject, value?: any): any {
    if (isObjectLike(key)) {
      each(key, (k, v) => {
        // @ts-ignore
        this[name](k, v);
      });

      return this;
    }

    if (arguments.length === 1) {
      const element = this[0];

      return isElement(element) ? get(element, key) : undefined;
    }

    return this.each((i, element) => {
      set(
        element,
        key,
        isFunction(value) ? value.call(element, i, get(element, key)) : value,
      );
    });
  };
});

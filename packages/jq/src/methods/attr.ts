import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import { isElement, isFunction, isObjectLike, isUndefined } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置元素的属性
     * @param attributeName
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
      attributeName: string,
      value:
        | string
        | number
        | null
        | ((
            this: HTMLElement,
            index: number,
            oldAttrValue: string,
          ) => string | number | void | undefined),
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
        | ((
            this: HTMLElement,
            index: number,
            oldAttrValue: string,
          ) => string | number | void | undefined)
      >,
    ): this;

    /**
     * 获取第一个元素的属性值
     * @param attributeName
     * @example
```js
$('div').attr('title');
```
     */
    attr(attributeName: string): string | undefined;
  }
}

each(['attr', 'prop', 'css'], (nameIndex, name) => {
  function set(element: HTMLElement, key: string, value: any): void {
    if (nameIndex === 0) {
      element.setAttribute(key, value);
    } else if (nameIndex === 1) {
      // @ts-ignore
      element[key] = value;
    } else {
      // @ts-ignore
      element.style[key] = value;
    }
  }

  function get(element: HTMLElement, key: string): any {
    if (nameIndex === 0) {
      return element.getAttribute(key);
    }

    if (nameIndex === 1) {
      // @ts-ignore
      return element[key];
    }

    return window.getComputedStyle(element, null).getPropertyValue(key);
  }

  $.fn[name] = function<T extends JQElement>(
    this: JQ<T>,
    key: string | PlainObject,
    value?: any,
  ): any {
    if (isObjectLike(key)) {
      each(key, (k, v) => {
        // @ts-ignore
        this[name](k, v);
      });

      return this;
    }

    if (isUndefined(value)) {
      const element = this[0];

      return isElement(element) ? get(element, key) : undefined;
    }

    return this.each((i, element) => {
      if (!isElement(element)) {
        return;
      }

      if (isFunction(value)) {
        value = value.call(element, i, get(element, key));
      }

      set(element, key, value);
    });
  };
});

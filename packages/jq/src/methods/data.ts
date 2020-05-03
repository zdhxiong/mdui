import $ from '../$';
import data from '../functions/data';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import {
  isObjectLike,
  isString,
  isUndefined,
  toCamelCase,
  toKebabCase,
} from '../utils';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在当前元素上存储数据
     *
     * `value` 为 `undefined` 时，不设置数据，直接返回原对象
     *
     * @param key 数据键名
     * @param value 数据值
     * @example
```js
$('.box').data('type', 'image')
```
     */
    data(key: string, value: any): this;

    /**
     * 在当前元素上存储数据
     * @param data 键值对数据
     * @example
```js
$('.box').data({
  width: 1020,
  height: 680,
})
```
     */
    data(data: PlainObject): this;

    /**
     * 获取在当前元素上存储的数据
     * @param key 数据键名
     * @example
```js
$('.box').data('height')
// 680
```
     */
    data(key: string): any;

    /**
     * 获取在当前元素上存储的所有数据
     * @example
```js
$('.box').data()
// { 'type': 'image', 'width': 1020, 'height': 680 }
```
     */
    data(): PlainObject;
  }
}

const rbrace = /^(?:{[\w\W]*\}|\[[\w\W]*\])$/;

// 从 `data-*` 中获取的值，需要经过该函数转换
function getData(value: string): any {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null') {
    return null;
  }

  if (value === +value + '') {
    return +value;
  }

  if (rbrace.test(value)) {
    return JSON.parse(value);
  }

  return value;
}

// 若 value 不存在，则从 `data-*` 中获取值
function dataAttr(element: HTMLElement, key: string, value?: any): any {
  if (isUndefined(value) && element.nodeType === 1) {
    const name = 'data-' + toKebabCase(key);
    value = element.getAttribute(name);

    if (isString(value)) {
      try {
        value = getData(value);
      } catch (e) {}
    } else {
      value = undefined;
    }
  }

  return value;
}

$.fn.data = function (this: JQ, key?: string | PlainObject, value?: any): any {
  // 获取所有值
  if (isUndefined(key)) {
    if (!this.length) {
      return undefined;
    }

    const element = this[0];
    const resultData = data(element);

    // window, document 上不存在 `data-*` 属性
    if (element.nodeType !== 1) {
      return resultData;
    }

    // 从 `data-*` 中获取值
    const attrs = element.attributes;
    let i = attrs.length;
    while (i--) {
      if (attrs[i]) {
        let name = attrs[i].name;
        if (name.indexOf('data-') === 0) {
          name = toCamelCase(name.slice(5));
          resultData[name] = dataAttr(element, name, resultData[name]);
        }
      }
    }

    return resultData;
  }

  // 同时设置多个值
  if (isObjectLike(key)) {
    return this.each(function () {
      data(this, key);
    });
  }

  // value 传入了 undefined
  if (arguments.length === 2 && isUndefined(value)) {
    return this;
  }

  // 设置值
  if (!isUndefined(value)) {
    return this.each(function () {
      data(this, key as string, value);
    });
  }

  // 获取值
  if (!this.length) {
    return undefined;
  }

  return dataAttr(this[0], key, data(this[0], key));
};

import { $ } from '../$.js';
import { dataAttr, get, getAll, set, setAll } from '../shared/data.js';
import {
  isUndefined,
  isObjectLike,
  eachObject,
  toCamelCase,
} from '../shared/helper.js';
import './each.js';
import type { JQ } from '../shared/core.js';
import type { PlainObject } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    data(key: string, value: unknown): this;

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
    data(key: string): unknown;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.data = function (this: JQ, key?: string | PlainObject, value?: any): any {
  // 获取所有值
  if (isUndefined(key)) {
    if (!this.length) {
      return undefined;
    }

    const element = this[0];
    const resultData = getAll(element);

    // window, document 上不存在 `dataset`
    if (element.nodeType !== 1) {
      return resultData;
    }

    // 若值未通过 data 方法设置，则从 `dataset` 中获取值。dataset 中读取的 key 会自动转为驼峰法
    eachObject(element.dataset, (key: string) => {
      resultData[key] = dataAttr(element, key, resultData[key]);
    });

    return resultData;
  }

  // 同时设置多个值
  if (isObjectLike(key)) {
    return this.each(function () {
      setAll(this, key);
    });
  }

  // value 传入了 undefined
  if (arguments.length === 2 && isUndefined(value)) {
    return this;
  }

  // 设置值
  if (!isUndefined(value)) {
    return this.each(function () {
      set(this, key as string, value);
    });
  }

  // 获取值
  if (!this.length) {
    return undefined;
  }

  return dataAttr(this[0], toCamelCase(key), get(this[0], key));
};

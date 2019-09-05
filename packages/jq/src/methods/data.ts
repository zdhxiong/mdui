import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import { isObjectLike, isUndefined } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import data from '../functions/data';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 在当前元素上存储数据
     * @param key
     * @param value
     * @example
```js
$('.box').data('type', 'image')
```
     */
    data(key: string, value: any): this;

    /**
     * 在当前元素上存储数据
     * @param obj
     * @example
```js
$('.box').data({
  width: 1020,
  height: 680,
})
```
     */
    data(obj: PlainObject): this;

    /**
     * 获取在当前元素上存储的数据
     * @param key
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

$.fn.data = function(this: JQ, key?: string | PlainObject, value?: any): any {
  // 同时设置多个值
  if (isObjectLike(key)) {
    return this.each((_, element) => {
      data(element, key);
    });
  }

  // 设置值
  if (!isUndefined(value)) {
    return this.each((_, element) => {
      data(element, key as string, value);
    });
  }

  if (!this[0]) {
    return undefined;
  }

  // 获取值
  if (!isUndefined(key)) {
    return data(this[0], key);
  }

  // 获取所有值
  return data(this[0]);
};

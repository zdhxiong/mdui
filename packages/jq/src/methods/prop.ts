import './attr.js';
import type { PlainObject } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的 JavaScript 属性值
     * @param name 属性名
     * @param value
     * 属性值，可以设置为任意值、或者回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的属性值，`this` 指向当前元素
     *
     * 若属性值或函数返回 `undefined`，则不修改当前属性
     * @example
```js
$('input').prop('checked', true);
```
     * @example
```js
$('input').prop('checked', function () {
  return true;
});
```
     */
    prop(
      name: string,
      value:
        | string
        | number
        | boolean
        | symbol
        | PlainObject
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldPropValue: unknown,
          ) =>
            | string
            | number
            | boolean
            | symbol
            | PlainObject
            | null
            | void
            | undefined),
    ): this;

    /**
     * 设置集合中所有元素的多个 JavaScript 属性值
     * @param properties
     * 键值对数据。键名为属性名，键值为属性值或回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的属性值，`this` 指向当前元素
     *
     * 若属性值或函数返回 `undefined`，则不修改对应属性
     * @example
```js
$('input').prop({
  checked: true,
  disabled: false,
});
```
     * @example
```js
$('input').prop({
  checked: function () {
    return true;
  },
  disabled: false,
});
```
     */
    prop(
      properties: PlainObject<
        | string
        | number
        | boolean
        | symbol
        | PlainObject
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldPropValue: unknown,
          ) =>
            | string
            | number
            | boolean
            | symbol
            | PlainObject
            | null
            | void
            | undefined)
      >,
    ): this;

    /**
     * 获取集合中第一个元素的 JavaScript 属性值
     * @param name 属性名
     * @example
```js
$('input').prop('checked');
```
     */
    prop(name: string): unknown;
  }
}

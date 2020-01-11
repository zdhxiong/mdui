import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置元素属性
     * @param name 属性名
     * @param value
     * 属性值，可以设置为任意值、或者回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的属性值，`this` 指向当前元素
     *
     * 若属性值或函数返回 `void` 或 `undefined`，则不修改当前属性
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
        | object
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldPropValue: any,
          ) =>
            | string
            | number
            | boolean
            | symbol
            | object
            | null
            | void
            | undefined),
    ): this;

    /**
     * 同时设置多个属性
     * @param properties
     * 键值对数据。键名为属性名，键值为属性值或回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的属性值，`this` 指向当前元素
     *
     * 若属性值或函数返回 `void` 或 `undefined`，则不修改对应属性
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
        | object
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldPropValue: any,
          ) =>
            | string
            | number
            | boolean
            | symbol
            | object
            | null
            | void
            | undefined)
      >,
    ): this;

    /**
     * 获取集合中第一个元素的属性值
     * @param name 属性名
     * @example
```js
$('input').prop('checked');
```
     */
    prop(name: string): any;
  }
}

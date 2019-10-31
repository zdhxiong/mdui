import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置元素的 CSS 属性
     * @param name CSS 属性名
     * @param value
     * CSS 属性值，可以是字符串或数值。
     *
     * 也可以是一个返回字符串或数值的回调函数。函数的第一个参数为元素的索引位置，第二个参数为旧的 CSS 属性值，`this` 指向当前元素
     *
     * 若属性值或回调函数返回 `void`、`undefined` 或 `null`，则不修改当前样式。
     *
     * 若属性值或回调函数返回数值，则会添加 `px` 作为单位。若该属性无法使用 `px` 作为单位，则会直接把值转为字符串。
     * @example
```js
$('#box').css('color', 'red')
```
     * @example
```js
$('#box').css('color', function () {
  return 'red';
});
```
     */
    css(
      name: string,
      value:
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldCssValue: string,
          ) => string | number | null | void | undefined),
    ): this;

    /**
     * 同时设置 CSS 属性
     * @param properties
     * 键值对数据。键名为 CSS 属性名，键值为 CSS 属性值或回调函数。
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的 CSS 属性值，`this` 指向当前元素
     *
     * 若属性值或回调函数返回 `void` 或 `undefined`，则不修改对应样式。
     *
     * 若属性值或回调函数返回数值，则会添加 `px` 作为单位。若该属性无法使用 `px` 作为单位，则会直接把值转为字符串。
     * @example
```js
$('#box').css({
  'color': 'red',
  'background-color': 'white'
})
```
     * @example
```js
$('#box').css({
  'color': function () {
    return 'red';
  },
  'background-color': 'white'
})
```
     */
    css(
      properties: PlainObject<
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldCssValue: string,
          ) => string | number | null | void | undefined)
      >,
    ): this;

    /**
     * 获取集合中第一个元素的 CSS 属性值
     * @param name 属性名
     * @example
```js
$('#box').css('color')
```
     */
    css(name: string): string;
  }
}

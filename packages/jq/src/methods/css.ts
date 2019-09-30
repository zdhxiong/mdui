import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置元素的样式
     * 如果值为 void 或 undefined，则不修改当前样式
     * @param name
     * @param value
     * @example ````设置样式
```js
$('#box').css('color', 'red')
```
     * @example ````通过函数返回值设置样式
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
        | undefined
        | ((
            this: T,
            index: number,
            oldCssValue: string,
          ) => string | number | void | undefined),
    ): this;

    /**
     * 同时设置多个样式
     * @param properties
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
        | undefined
        | ((
            this: T,
            index: number,
            oldCssValue: string,
          ) => string | number | void | undefined)
      >,
    ): this;

    /**
     * 获取第一个元素的样式
     * @param name
     * @example
```js
$('#box').css('color')
```
     */
    css(name: string): string;
  }
}

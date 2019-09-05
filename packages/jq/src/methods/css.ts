import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置元素的样式
     * @param propertyName
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
      propertyName: string,
      value:
        | string
        | number
        | null
        | ((
            this: HTMLElement,
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
        | null
        | ((
            this: HTMLElement,
            index: number,
            oldCssValue: string,
          ) => string | number | void | undefined)
      >,
    ): this;

    /**
     * 获取第一个元素的样式
     * @param propertyName
     * @example
```js
$('#box').css('color')
```
     */
    css(propertyName: string): string | undefined;
  }
}

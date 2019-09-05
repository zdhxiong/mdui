import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置元素属性
     * @param propertyName
     * @param value
     * @example ````设置属性
```js
$('input').prop('checked', true);
```
     * @example ````通过函数返回值设置属性
```js
$('input').prop('checked', function () {
  return true;
});
```
     */
    prop(
      propertyName: string,
      value:
        | any
        | ((this: HTMLElement, index: number, oldPropValue: any) => any),
    ): this;

    /**
     * 同时设置多个属性
     * @param properties
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
        any | ((this: HTMLElement, index: number, oldPropValue: any) => any)
      >,
    ): this;

    /**
     * 获取第一个元素的属性
     * @param propertyName
     * @example
```js
$('input').prop('checked');
```
     */
    prop(propertyName: string): any;
  }
}

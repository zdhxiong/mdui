import PlainObject from '../interfaces/PlainObject';
import './attr';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置元素属性
     * 如果值为 void 或 undefined，则不修改当前属性
     * @param name
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
            | undefined
          ),
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
            | undefined
          )
      >,
    ): this;

    /**
     * 获取第一个元素的属性
     * @param name
     * @example
```js
$('input').prop('checked');
```
     */
    prop(name: string): any;
  }
}

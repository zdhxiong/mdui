import './width';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中所有元素的宽度（包含 `padding`, `border` 的宽度，由第二个参数决定是否包含 `margin` 的宽度）
     * @param value
     * 可以是带单位的字符串，或者数值；或者是返回带单位的字符串或数值的回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的宽度值，`this` 指向当前元素
     *
     * 若该值、或函数返回值是数值，则自动添加 `px` 作为单位
     *
     * 若该值、或函数返回值是 `null` 或 `undefined`，则不修改元素的宽度
     * @param includeMargin 是否包含 `margin` 的宽度
     * @example
```js
$('.box').outerWidth('20%');
```
     * @example
```js
$('.box').outerWidth(10);
```
     */
    outerWidth(
      value:
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldValue: number,
          ) => string | number | null | undefined | void),
      includeMargin?: boolean,
    ): this;

    /**
     * 获取集合中第一个元素的宽度（像素值），包含 `padding`, `border` 的宽度，由 `includeMargin` 参数决定是否包含 `margin` 的的宽度
     * @param includeMargin 是否包含 `margin` 的宽度
     * @example
```js
$('.box').outerWidth()
```
     * @example
```js
$('.box').outerWidth(true)
```
     */
    outerWidth(includeMargin?: boolean): number;
  }
}

import './addClass';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 移除集合中每个元素上的 CSS 类
     * @param className
     * CSS 类名、或返回 CSS 类名的回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为旧的 CSS 类名，`this` 指向当前元素
     *
     * 多个 CSS 类名可以用空格分隔
     *
     * 若没有指定该参数，则将直接移除元素上的 `class` 属性
     * @example
```js
$('p').removeClass('item')
```
     * @example
```js
$('p').removeClass('item1 item2')
```
     * @example
```js
$('p').removeClass(function () {
  return 'item1';
});
```
     */
    removeClass(
      className?:
        | string
        | ((this: T, index: number, oldClassName: string) => string),
    ): this;
  }
}

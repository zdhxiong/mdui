import './addClass';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 移除 CSS 类，多个类名用空格分隔
     * @param className
     * @example ````移除 p 元素上的 item 类
```js
$('p').removeClass('item')
```
     * @example ````移除 p 元素上的 item1 和 item2 两个类
```js
$('p').removeClass('item1 item2')
```
     * @example ````移除 p 元素上的由回调函数返回的类
```js
$('p').removeClass(function () {
  return 'item1';
});
```
     */
    removeClass(
      className?:
        | string
        | ((this: T, index: number, currentClassName: string) => string),
    ): this;
  }
}

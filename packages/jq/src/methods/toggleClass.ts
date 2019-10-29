import './addClass';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 元素上的 CSS 类，有则删除，无则添加
     * @param className
     * CSS 类名。可以是字符串、或返回字符串的回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素当前的 CSS 类名，`this` 指向当前元素
     *
     * 多个类名之间可以用空格分隔
     * @example
```js
// p 元素上有 item 类，则移除；否则，添加 item 类
$('p').toggleClass('item')
```
     * @example
```js
// 切换 p 元素上的由回调函数返回的类
$('p').toggleClass(function () {
  return 'item';
});
```
     */
    toggleClass(
      className:
        | string
        | ((this: T, index: number, currentClassName: string) => string),
    ): this;
  }
}

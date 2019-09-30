import './innerWidth';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取元素的高度，包含内边距
     * @example
```js
$('.box').innerHeight()
```
     */
    innerHeight(): number;
  }
}

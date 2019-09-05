import JQElement from '../types/JQElement';
import './innerWidth';

declare module '../JQ' {
  interface JQ<T = JQElement> {
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

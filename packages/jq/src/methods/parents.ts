import Selector from '../types/Selector';
import './parent';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回匹配的所有祖先元素的 JQ 对象。
     * $( "html" ).parents()返回一个空集合。
     * @param selector
     * @example ````返回 span 元素的所有祖先元素
```js
$('span').parents()
```
     * @example ````返回 span 元素的所有是 p 元素的祖先元素
```js
$('span').parents('p');
```
     */
    parents(selector?: Selector): this;
  }
}

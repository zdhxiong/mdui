import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import './next';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取当前元素后面的所有匹配的同辈元素
     * @param selector
     * @example ````获取 .box 元素后面的所有同辈元素
```js
$('.box').nextAll()
```
     * @example ````获取 .box 元素后面的所有含 .selected 的同辈元素
```js
$('.box').nextAll('.selected')
```
     */
    nextAll(selector?: JQSelector): this;
  }
}

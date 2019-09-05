import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import './prev';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取当前元素前面的所有匹配的同辈元素
     * @param selector
     * @example ````获取 .box 元素前面的所有同辈元素
```js
$('.box').prevAll()
```
     * @example ````获取 .box 元素前面的所有含 .selected 的同辈元素
```js
$('.box').prevAll('.selected')
```
     */
    prevAll(selector?: JQSelector): this;
  }
}

import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import './next';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取当前元素后面所有的同辈元素，直到遇到匹配元素，不包含匹配元素。
     * @param selector
     * @example
```js
$('.box').nextUntil('.until')
```
     */
    nextUntil(selector: JQSelector): this;
  }
}

import Selector from '../types/Selector';
import './next';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前元素后面所有的同辈元素，直到遇到匹配元素，不包含匹配元素。
     * @param selector
     * @example
```js
$('.box').nextUntil('.until')
```
     */
    nextUntil(selector?: Selector | HTMLElement | JQ, filter?: Selector): this;
  }
}

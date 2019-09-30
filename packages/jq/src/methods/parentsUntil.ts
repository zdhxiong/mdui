import Selector from '../types/Selector';
import './parent';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 查找当前元素的所有父辈元素，直到遇到匹配的那个元素为止（不含匹配的元素）。
     * @param selector
     * @example
```js
$('.item').parentsUntil('.parent');
```
     */
    parentsUntil(
      selector?: Selector | HTMLElement | JQ,
      filter?: Selector,
    ): this;
  }
}

import Selector from '../types/Selector';
import './prev';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前元素前面所有的同辈元素，直到遇到匹配元素，不包含匹配元素。
     * @param selector
     * @example
     ```js
     $('.box').prevUntil('.until')
     ```
     */
    prevUntil(selector?: Selector | HTMLElement | JQ, filter?: Selector): this;
  }
}

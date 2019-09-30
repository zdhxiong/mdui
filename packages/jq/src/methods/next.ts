import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import dir from './utils/dir';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前元素的后一个匹配的同辈元素
     * @param selector
     * @example ````获取 .box 元素的后一个元素
```js
$('.box').next()
```
     * @example ````获取 .box 元素的后一个 div 元素
```js
$('.box').next('div')
```
     */
    next(selector?: Selector): this;
  }
}

each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`next${name}`] = function(
    this: JQ,
    selector?: any,
    filter?: Selector,
  ): JQ {
    return dir(this, nameIndex, 'nextElementSibling', selector, filter);
  };
});

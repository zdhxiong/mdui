import Selector from '../types/Selector';
import './prev';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中，每个元素前面的所有匹配的同辈元素的集合
     * @param selector CSS 选择器。指定该参数时，将仅返回和该参数匹配的元素的集合
     * @example
```js
// 获取 .box 元素前面的所有同辈元素
$('.box').prevAll()
```
     * @example
```js
// 获取 .box 元素前面的所有含 .selected 的同辈元素
$('.box').prevAll('.selected')
```
     */
    prevAll(selector?: Selector): this;
  }
}

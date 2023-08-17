import './parent.js';
import type { Selector } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中，所有元素的祖先元素的集合。
     * @param selector CSS 选择器。若指定了该参数，则仅返回与该参数匹配的祖先元素的集合
     * @example
```js
// 返回 span 元素的所有祖先元素
$('span').parents()
```
     * @example
```js
// 返回 span 元素的所有是 p 元素的祖先元素
$('span').parents('p');
```
     */
    parents(selector?: Selector): this;
  }
}

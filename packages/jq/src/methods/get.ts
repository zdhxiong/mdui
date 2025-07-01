import { $ } from '../$.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取集合中指定索引位置的元素
     * @param index 索引位置
     * @example
```js
// 获取第 3 个 p 元素
$('p').get(2)
```
     * @example
```js
// 获取最后一个 p 元素
$('p').get(-1)
```
     */
    get(index: number): T;

    /**
     * 获取集合中所有元素组成的数组
     * @example
```js
// 获取所有 p 元素组成的数组
$('p').get()
```
     */
    get(): T[];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.get = function (this: JQ, index?: number): any | any[] {
  return index === undefined
    ? [].slice.call(this)
    : this[index >= 0 ? index : index + this.length];
};

import $ from '../$';
import { JQ } from '../JQ';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取指定索引位置的 Dom 元素
     * @param index 索引号
     * @example ````获取第 3 个 p 元素
```js
$('p').get(2)
```
     * @example ````获取最后一个 p 元素
```js
$('p').get(-1)
```
     */
    get(index: number): T;

    /**
     * 获取 Dom 元素组成的数组
     * @example ````获取所有 p 元素组成的数组
````js
$('p').get()
````
     */
    get(): T[];
  }
}

$.fn.get = function(this: JQ, index?: number): any | any[] {
  return index === undefined
    ? [].slice.call(this)
    : this[index >= 0 ? index : index + this.length];
};

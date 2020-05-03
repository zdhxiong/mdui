import $ from '../$';
import removeData from '../functions/removeData';
import { JQ } from '../JQ';
import TypeOrArray from '../types/TypeOrArray';
import './each';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 移除元素上存储的数据
     *
     * 该方法只会删除通过 `.data()` 方法设置的数据，不会删除 `data-*` 属性上的数据
     * @param name
     * 数据键名
     *
     * 若未指定键名，则将移除元素上所有数据
     *
     * 多个键名可以用空格分隔，或者用数组表示多个键名
     * @example
```js
// 移除指定键名的数据
$('.box').removeData('key');
```
     * @example
```js
// 移除键名为 key1 和 key2 的数据
$('.box').removeData('key1 key2');
```
     * @example
```js
// 移除键名为 key1 和 key2 的数据
$('.box').removeData(['key1', 'key2']);
```
     * @example
```js
// 移除元素上所有数据
$('.box').removeData();
```
     */
    removeData(name?: TypeOrArray<string>): this;
  }
}

$.fn.removeData = function (this: JQ, name?: TypeOrArray<string>): JQ {
  return this.each(function () {
    removeData(this, name);
  });
};

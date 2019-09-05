import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import removeData from '../functions/removeData';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 移除元素上存储的数据。若未指定键名，则移除元素上所有数据
     * @param name
     * @example ````移除指定键名的数据
```js
$('.box').removeData('key');
```
     * @example ````移除元素上所有数据
```js
$('.box').removeData();
```
     */
    removeData(name?: string): this;
  }
}

$.fn.removeData = function(this: JQ, name?: string): JQ {
  return this.each((_, element) => {
    removeData(element, name);
  });
};

import $ from '../$';
import removeData from '../functions/removeData';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 移除指定元素上存放的数据
     * @param element 存放数据的元素
     * @param name 数据键名。若未指定键名，将移除元素上所有数据
     * @example
```js
// 移除元素上键名为 name 的数据
$.removeData(document.body), 'name');
```
     * @example
```js
// 移除元素上所有数据
$.removeData(document.body);
```
     */
    removeData(element: Element | Document | Window, name?: string): void;
  }
}

$.removeData = removeData;

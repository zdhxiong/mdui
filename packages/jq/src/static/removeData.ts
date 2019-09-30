import $ from '../$';
import removeData from '../functions/removeData';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 移除指定元素上存放的数据。若没有指定 name，则移除元素上的所有数据
     * @param element 存放数据的元素
     * @param name 数据键名
     * @example 移除元素上键名为 name 的数据
```js
var element = document.getElementById('test');
if (element) {
  $.removeData(element, 'name');
}
     ```
     * @example 移除元素上所有数据
```js
var element = document.getElementById('test');
if (element) {
  $.removeData(element);
}
```
     */
    removeData(element: Element | Document | Window, name?: string): void;
  }
}

$.removeData = removeData;

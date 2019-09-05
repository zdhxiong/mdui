import JQElement from '../types/JQElement';
import $ from '../$';
import removeData from '../functions/removeData';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 移除指定元素上存放的数据
     * @param element 存放数据的元素
     * @param key 数据键名
     * @example
```js
var element = document.getElementById('test');
if (element) {
  $.removeData(element, 'name');
}
     ```
     */
    removeData(element: JQElement, key: string): void;
  }
}

$.removeData = removeData;

import JQElement from '../types/JQElement';
import PlainObject from '../interfaces/PlainObject';
import $ from '../$';
import data from '../functions/data';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 在指定元素上存储数据，返回设置的值
     * @param element 用于存储数据的元素
     * @param key 数据键名
     * @param value 数据值
     * @example
```js
$.data(document.body, 'type', 'image')
// 'image'
```
     */
    data<T>(element: JQElement, key: string, value: T): T;

    /**
     * 在指定元素上存储数据，返回设置的键值对数据
     * @param element 用于存储数据的元素
     * @param data 键值对数据
     * @example
```js
$.data(document.body, { 'width': 1020, 'height': 680 })
// { 'width': 1020, 'height': 680 }
```
     */
    data<T extends PlainObject>(element: JQElement, data: T): T;

    /**
     * 获取在指定元素上存储的指定键名对应的值
     * @param element 用于存储数据的元素
     * @param key 数据键名
     * @example
```js
$.data(document.body, 'height')
// 680
```
     */
    data(element: JQElement, key: string): any;

    /**
     * 获取指定元素上存储的所有数据
     * @param element 用于存储数据的元素
     * @example
```js
$.data(document.body)
// { 'type': 'image', 'width': 1020, 'height': 680 }
```
     */
    data(element: JQElement): PlainObject;
  }
}

$.data = data;

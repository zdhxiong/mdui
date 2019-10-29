import $ from '../$';
import data from '../functions/data';
import PlainObject from '../interfaces/PlainObject';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * `value` 为 `undefined` 时，相当于 `$.data(element, key)`，即获取指定元素上存储的数据
     *
     * Note: 该方法不检索 `data-*` 属性
     *
     * @param element 用于存储数据的元素
     * @param key 数据键名
     * @param value `undefined`
     * @example
```js
data(document.body, 'type', undefined)
```
     */
    data(
      element: Element | Document | Window,
      key: string,
      value: undefined,
    ): any;

    /**
     * 在指定元素上存储数据，返回存储的值
     * @param element 用于存储数据的元素
     * @param key 数据键名
     * @param value 数据值
     * @example
```js
data(document.body, 'type', 'image')
// 'image'
```
     */
    data<T>(element: Element | Document | Window, key: string, value: T): T;

    /**
     * 获取在指定元素上存储的数据
     *
     * Note: 该方法不检索 `data-*` 属性
     *
     * @param element 用于存储数据的元素
     * @param key 数据键名
     * @example
```js
data(document.body, 'key')
```
     */
    data(element: Element | Document | Window, key: string): any;

    /**
     * 获取指定元素上存储的所有数据
     *
     * Note: 该方法不检索 data-* 属性
     *
     * @param element 用于存储数据的元素
     * @example
```js
data(document.body)
// { 'type': 'image', 'width': 1020, 'height': 680 }
```
     */
    data(element: Element | Document | Window): PlainObject;

    /**
     * 在指定元素上存储数据，返回存储的键值对数据
     * @param element 用于存储数据的元素
     * @param data 键值对数据
     * @example
```js
data(document.body, { 'width': 1020, 'height': 680 })
// { 'width': 1020, 'height': 680 }
```
     */
    data<T extends PlainObject>(
      element: Element | Document | Window,
      data: T,
    ): T;
  }
}

$.data = data;

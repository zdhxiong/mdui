import { PlainObject, isUndefined, isObjectLike } from '../shared/helper.js';
import { get, set, getAll, setAll } from '../shared/data.js';

/**
 * `value` 为 `undefined` 时，相当于 `data(element, key)`，即获取指定元素上存储的数据
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
export function data(
  element: Element | Document | Window,
  key: string,
  value: undefined,
): unknown;

/**
 * 在指定元素上存储数据，返回存储的值。
 * @param element 用于存储数据的元素
 * @param key 数据键名
 * @param value 数据值
 * @example
```js
data(document.body, 'type', 'image')
// 'image'
```
 */
export function data<T>(
  element: Element | Document | Window,
  key: string,
  value: T,
): T;

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
export function data(
  element: Element | Document | Window,
  key: string,
): unknown;

/**
 * 获取指定元素上存储的所有数据
 *
 * Note: 该方法不检索 `data-*` 属性
 *
 * @param element 用于存储数据的元素
 * @example
```js
data(document.body)
// { 'type': 'image', 'width': 1020, 'height': 680 }
```
 */
export function data(element: Element | Document | Window): PlainObject;

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
export function data<T extends PlainObject>(
  element: Element | Document | Window,
  data: T,
): T;

export function data(
  element: Element | Document | Window,
  key?: string | PlainObject,
  value?: unknown,
): unknown {
  // 根据键值对设置值
  // data(element, { 'key' : 'value' })
  if (isObjectLike(key)) {
    setAll(element, key);
    return key;
  }

  // 根据 key、value 设置值
  // data(element, 'key', 'value')
  if (!isUndefined(value)) {
    set(element, key as string, value);
    return value;
  }

  // 获取所有值
  // data(element)
  if (isUndefined(key)) {
    return getAll(element);
  }

  // 获取指定值
  // data(element, 'key')
  return get(element, key);
}

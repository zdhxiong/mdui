import { getWindow } from 'ssr-window';
import { each } from './each.js';
import type { PlainObject } from '../shared/helper.js';

/**
 * 遍历数组，通过函数返回值生成一个新数组
 *
 * @param array 被遍历的数组
 * @param callback 处理每个元素的回调函数
 *
 * 函数的第一个参数是数组值，第二个参数是数组索引，`this` 指向 `window` 对象
 *
 * 函数可以返回任何值，若返回数组，则会被展开；若返回 `null` 或 `undefined`，则不会被放入新生成的数组中
 * @example
```js
// 数组的每个元素都 +4
map([0, 1, 2], function(value){
  return value + 4;
});
// [4, 5, 6]
```
 * @example
```js
// 移除小于 2 的值
map([0, 1, 2, 3], function(value){
  return value >= 2 ? value : null;
});
// [2, 3]
```
 * @example
```js
// 返回数组时，展开
map([1, 2, 3], function(value, index){
    return [index, value];
});
// [0, 1, 1, 2, 2, 3]
```
 */
export function map<T, TReturn>(
  array: ArrayLike<T>,
  callback: (
    this: Window,
    value: T,
    index: number,
  ) => TReturn | TReturn[] | null | undefined,
): TReturn[];

/**
 * 循环对象，通过函数返回值生成一个新数组
 *
 * @param obj 被遍历的对象
 * @param callback 处理每个元素的回调函数
 *
 * 函数的第一个参数为对象值，第二个参数为对象键，`this` 指向 `window` 对象
 *
 * 函数可以返回任何值，若返回数组，则会被展开；若返回 `null` 或 `undefined`，则不会被放入新生成的数组中
 * @example
```js
// 值 +2
map({ width: 1, height: 2 }, function(value, key){
  return value + 2;
});
// [3, 4]
```
 * @example
```js
// 获取键名组成的数组
map({ width: 1, height: 2 }, function(value, key){
  return key;
});
// ['width', 'height']
```
 * @example
```js
// 返回数组时，展开
map({ width: 1, height: 2 }, function(value, key){
  return [key, value];
});
// ['width', 1, 'height', 2]
```
 */
export function map<T extends PlainObject, K extends keyof T, TReturn>(
  obj: T,
  callback: (
    this: Window,
    value: T[K],
    key: K,
  ) => TReturn | TReturn[] | null | undefined,
): TReturn[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-function-type
export function map(elements: any, callback: Function): unknown {
  const window = getWindow();
  let value;
  const ret: never[] = [];

  each(elements, (i, element) => {
    value = callback.call(window, element, i);

    if (value != null) {
      ret.push(value as never);
    }
  });

  return [].concat(...ret);
}

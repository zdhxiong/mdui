import PlainObject from '../interfaces/PlainObject';
import { isNull, isUndefined } from '../utils';
import each from './each';

/**
 * 遍历数组，通过函数返回值生成一个新数组，null 和 undefined 将被过滤掉。
 * @param array 被遍历的数组
 * @param callback 处理每个元素的回调函数。
 *                 第一个参数是数组值，第二个参数是数组索引。
 *                 函数可以返回任何值，若返回数组，则会被展开；若返回 null 或 undefined，则不会被放入新生成的数组中。
 *                 函数内部的 this 指向 window 对象。
 * @example ````数组的每个元素都 +4
```js
map( [ 0, 1, 2 ], function( value ) {
  return value + 4;
});
// [ 4, 5, 6 ]
```
 * @example ````移除小于 2 的值
```js
map([ 0, 1, 2, 3 ], function ( value ) {
  return value >= 2 ? value : null;
});
// [ 2, 3 ]
```
 * @example ````返回数组时，展开
```js
map( [ 1, 2, 3 ], function( value, index ) {
    return [ index, value ];
});
// [ 0, 1, 1, 2, 2, 3 ]
```
 */
function map<T, TReturn>(
  array: ArrayLike<T>,
  callback: (
    this: Window,
    value: T,
    index: number,
  ) => TReturn | TReturn[] | null | undefined,
): TReturn[];

/**
 * 循环对象，通过函数返回值生成一个新数组，null 和 undefined 将被过滤掉。
 * @param obj 被遍历的对象
 * @param callback 处理每个元素的回调函数。
 *                 第一个参数为对象值，第二个参数为对象键。
 *                 函数可以返回任何值，若返回数组，则会被展开；若返回 null 或 undefined，则不会被放入新生成的数组中。
 *                 函数内部的 this 指向 window 对象。
 * @example ````值 +2
```js
map( { width: 1, height: 2 }, function( value, key ) {
  return value + 2;
});
// [ 3, 4 ]
```
 * @example ````获取键名组成的数组
```js
map( { width: 1, height: 2 }, function( value, key ) {
  return key;
});
// [ 'width', 'height' ]
```
 */
function map<T extends PlainObject, K extends keyof T, TReturn>(
  obj: T,
  callback: (
    this: Window,
    value: T[K],
    key: K,
  ) => TReturn | TReturn[] | null | undefined,
): TReturn[];

function map(elements: any, callback: Function): any {
  let value;
  const ret: any[] = [];

  each(elements, (i, element) => {
    value = callback.call(window, element, i);

    if (!isNull(value) && !isUndefined(value)) {
      ret.push(value);
    }
  });

  return [].concat(...ret);
}

export default map;

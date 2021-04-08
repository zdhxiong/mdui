import {
  PlainObject,
  isArrayLike,
  eachArray,
  eachObject,
} from '../shared/core.js';

/**
 * 遍历数组，原样返回第一个参数
 *
 * @param array 需要遍历的数组
 * @param callback 为数组中每个元素执行的回调函数
 *
 * 函数的第一个参数为数组的索引，第二个参数为对应的索引的值，`this` 也指向该值
 *
 * 函数返回 `false` 时，停止遍历
 * @example
```js
each( [ "a", "b", "c" ], function( index, value ){
  alert( "Index #" + index + ": " + value );
});
```
 */
function each<T>(
  array: ArrayLike<T>,
  callback: (this: T, index: number, value: T) => any | void,
): ArrayLike<T>;

/**
 * 遍历对象，原样返回第一个参数
 *
 * @param obj 需要遍历的对象
 * @param callback 为对象中每个元素执行的回调函数
 *
 * 函数的第一个参数为对象的键名，第二个参数为对应的键值，`this` 也指向该值
 *
 * 函数返回 `false` 时，停止遍历
 * @example
```js
each({ name: "John", lang: "JS" }, function( key, value ) {
  alert( "Key: " + key + ", Value: " + value );
});
```
 */
function each<T extends PlainObject, K extends keyof T>(
  obj: T,
  callback: (this: T[K], key: K, value: T[K]) => any | void,
): T;

function each(target: any, callback: any): any {
  return isArrayLike(target)
    ? eachArray(target, callback)
    : eachObject(target, callback);
}

export default each;

import { isArrayLike } from '../utils';
import PlainObject from '../interfaces/PlainObject';

/**
 * 遍历数组，原样返回第一个参数。回调函数返回 false 时，停止遍历
 * @param array 需要遍历的数组
 * @param callback 为数组中每个元素执行的回调函数
 * @example
```js
each( [ "a", "b", "c" ], function( index, value ){
  alert( "Index #" + index + ": " + value );
});
```
 */
function each<T>(
  array: ArrayLike<T>,
  callback: (this: T, index: number, value: T) => any | false,
): ArrayLike<T>;

/**
 * 遍历对象，原样返回第一个参数。回调函数返回 false 时，停止遍历
 * @param obj 需要遍历的对象
 * @param callback 为对象中每个元素执行的回调函数
 * @example
```js
each({ name: "John", lang: "JS" }, function( key, value ) {
  alert( "Key: " + key + ", Value: " + value );
});
```
 */
function each<T extends PlainObject, K extends keyof T>(
  obj: T,
  callback: (this: T[K], key: K, value: T[K]) => any | false,
): T;

function each(target: ArrayLike<any> | PlainObject, callback: Function): any {
  if (isArrayLike(target)) {
    for (let i = 0; i < target.length; i += 1) {
      if (callback.call(target[i], i, target[i]) === false) {
        return target;
      }
    }
  } else {
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i += 1) {
      if (callback.call(target[keys[i]], keys[i], target[keys[i]]) === false) {
        return target;
      }
    }
  }

  return target;
}

export default each;

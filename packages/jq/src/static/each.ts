import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 遍历数组，原样返回第一个参数。回调函数返回 false 时，停止遍历
     * @param array 需要遍历的数组
     * @param callback 为数组中每个元素执行的回调函数
     * @example
```js
$.each( [ "a", "b", "c" ], function( index, value ){
  alert( "Index #" + index + ": " + value );
});
```
     */
    each<T>(
      array: ArrayLike<T>,
      callback: (this: T, index: number, value: T) => any | false,
    ): ArrayLike<T>;

    /**
     * 遍历对象，原样返回第一个参数。回调函数返回 false 时，停止遍历
     * @param obj 需要遍历的对象
     * @param callback 为对象中每个元素执行的回调函数
     * @example
```js
$.each({ name: "John", lang: "JS" }, function( key, value ) {
  alert( "Key: " + key + ", Value: " + value );
});
```
     */
    each<T extends PlainObject, K extends keyof T>(
      obj: T,
      callback: (this: T[K], key: K, value: T[K]) => any | false,
    ): T;
  }
}

$.each = each;

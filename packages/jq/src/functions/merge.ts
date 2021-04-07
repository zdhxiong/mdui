import each from './each.js';

/**
 * 把第二个数组的元素追加到第一个数组中，并返回合并后的数组
 * @param first 第一个数组
 * @param second 该数组的元素将被追加到第一个数组中
 * @example
```js
merge( [ 0, 1, 2 ], [ 2, 3, 4 ] )
// [ 0, 1, 2, 2, 3, 4 ]
```
 */
const merge = <T, U>(first: T[], second: U[]): Array<T | U> => {
  each(second, (_, value) => {
    first.push(value as any);
  });

  return first;
};

export default merge;

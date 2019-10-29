import each from './each';

/**
 * 过滤掉数组中的重复元素
 * @param arr 数组
 * @example
```js
unique([1, 2, 12, 3, 2, 1, 2, 1, 1]);
// [1, 2, 12, 3]
```
 */
function unique(arr: any[]): any[] {
  const result: any[] = [];

  each(arr, (_, val) => {
    if (result.indexOf(val) === -1) {
      result.push(val);
    }
  });

  return result;
}

export default unique;

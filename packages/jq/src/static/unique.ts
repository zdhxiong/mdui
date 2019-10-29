import $ from '../$';
import unique from '../functions/unique';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 过滤掉数组中的重复元素
     * @param arr 数组
     * @example
```js
unique([1, 2, 12, 3, 2, 1, 2, 1, 1]);
// [1, 2, 12, 3]
```
     */
    unique(arr: any[]): any[];
  }
}

$.unique = unique;

import $ from '../$.js';
import unique from '../functions/unique.js';

declare module '../shared/core.js' {
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

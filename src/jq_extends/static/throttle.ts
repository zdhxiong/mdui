import $ from 'mdui.jq/es/$';
import { isNull } from 'mdui.jq/es/utils';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 函数节流
     * @param fn 执行的函数
     * @param delay 最多多少毫秒执行一次
     * @example
```js
$.throttle(function () {
  console.log('这个函数最多 100ms 执行一次');
}, 100)
```
     */
    throttle(fn: () => void, delay: number): () => void;
  }
}

$.throttle = function (fn: () => void, delay = 16): () => void {
  let timer: any = null;

  return function (this: any, ...args: any): void {
    if (isNull(timer)) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
};

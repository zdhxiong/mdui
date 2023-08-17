import { getWindow } from 'ssr-window';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThrottledFunc<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

/**
 * 创建一个节流函数
 * @param func 要执行的函数
 * @param wait 最多多少毫秒执行一次
 * @example
```js
window.addEventListener('scroll', throttle(() => {
  console.log('这个函数最多 100ms 执行一次');
}, 100));
```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any) => any>(
  func: T,
  wait = 0,
): ThrottledFunc<T> => {
  const window = getWindow();
  let timer: number | undefined;
  let result: ReturnType<T>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: any): ReturnType<T> {
    if (timer === undefined) {
      timer = window.setTimeout(() => {
        result = func.apply(this, args);
        timer = undefined;
      }, wait);
    }

    return result;
  };
};

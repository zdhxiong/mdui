import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { getBreakpoint } from './getBreakpoint.js';
import { throttle } from './throttle.js';
import type { Breakpoint } from '@mdui/shared/helpers/breakpoint.js';

interface Options {
  /**
   * 是否仅在断点变化时触发回调
   */
  breakpoint?: boolean;

  /**
   * 如果需要对回调函数的调用进行节流，可以指定该参数。表示在多少毫秒内最多调用一次回调函数
   */
  throttle?: false | number;
}

interface Entry extends ResizeObserverEntry {
  /**
   * 当前断点。取值为：
   * * `handset`：手机
   * * `small-tablet`：小平板
   * * `large-tablet`：大平板
   * * `desktop`：桌面电脑
   */
  breakpoint: Readonly<Breakpoint>;
}

interface Observer {
  /**
   * 取消监听
   */
  unobserve: () => void;
}

type Callback = (this: Observer, entry: Entry, observer: Observer) => void;

interface CallbackOptions {
  /**
   * 执行的回调函数
   */
  callback: Callback;

  /**
   * 是否仅在断点变更时执行回调函数
   */
  breakpoint: boolean;

  /**
   * 上次触发时的断点值
   */
  breakpointValue: string;

  /**
   * 唯一ID
   * 在同一个元素上绑定了多个监听器时，用于在取消监听时，判断取消哪一个回调函数
   */
  key: number;
}

let weakMap: WeakMap<HTMLElement, CallbackOptions[]>;

// ResizeObserver 实例，所有 resizeObserver 函数内部共用一个 ResizeObserver 实例
let observer: ResizeObserver;

/**
 * 监听元素的尺寸变化
 * @param target 监听该元素的尺寸变化
 * @param callback 尺寸变化时执行的回调函数
 * @param options
 */
export const resizeObserver = (
  target: HTMLElement,
  callback: Callback,
  options: Options = {},
): Observer => {
  const key = uniqueId();

  // 取消监听函数
  const result: Observer = {
    unobserve: () => {
      const coArr = weakMap.get(target) ?? [];

      const index = coArr.findIndex((co) => co.key === key);
      if (index !== -1) {
        coArr.splice(index, 1);
      }

      if (!coArr.length) {
        observer.unobserve(target);
        weakMap.delete(target);
      } else {
        weakMap.set(target, coArr);
      }
    },
  };

  // 初始化
  if (!weakMap) {
    weakMap = new WeakMap();
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const coArr = weakMap.get(target)!;
        coArr.forEach((co) => {
          const newBreakpointValue = getBreakpoint(target);

          if (
            !co.breakpointValue ||
            !co.breakpoint ||
            (co.breakpoint && co.breakpointValue !== newBreakpointValue)
          ) {
            co.breakpointValue = newBreakpointValue;

            co.callback.call(
              result,
              {
                breakpoint: newBreakpointValue,
                ...entry,
              },
              result,
            );
          }
        });
      });
    });
  }

  // 合并配置项
  const defaultOptions: Required<Options> = {
    breakpoint: false,
    throttle: false,
  };
  const mergedOptions = Object.assign({}, defaultOptions, options);

  // 添加监听
  observer.observe(target);
  const coArr = weakMap.get(target) ?? [];
  coArr.push({
    callback:
      mergedOptions.throttle === false
        ? callback
        : throttle(callback, mergedOptions.throttle),
    breakpoint: mergedOptions.breakpoint,
    breakpointValue: '',
    key,
  });
  weakMap.set(target, coArr);

  return result;
};

import { getDocument } from 'ssr-window';
import { getBreakpoint } from './getBreakpoint.js';
import { throttle } from './throttle.js';
import type { Breakpoint } from '@mdui/shared/helpers/breakpoint.js';

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

interface Options {
  /**
   * 监听的元素
   */
  target?: HTMLElement;

  /**
   * 是否仅在断点变化时触发回调
   */
  onlyBreakpointChange?: boolean;

  /**
   * 如果需要对回调函数的调用进行节流，可以指定该参数。表示在多少毫秒内最多调用一次回调函数
   */
  throttle?: false | number;
}

interface WatchResize {
  /**
   * 取消监听
   */
  unwatch: () => void;
}

/**
 * 监听元素的尺寸变化
 * @param callback
 * @param options
 */
export const watchResize = (
  callback: (this: WatchResize, entry: Entry) => void,
  options: Options = {},
): WatchResize => {
  const document = getDocument();
  const defaultOptions: Required<Options> = {
    target: document.body,
    onlyBreakpointChange: false,
    throttle: false,
  };
  const mergedOptions = Object.assign({}, defaultOptions, options);
  const result: WatchResize = {
    unwatch: () => {
      return;
    },
  };
  let breakpoint: Breakpoint | undefined = undefined;

  const func =
    mergedOptions.throttle === false
      ? callback
      : throttle(callback, mergedOptions.throttle);

  const resizeObserver = new ResizeObserver((entries) => {
    const newBreakpoint = getBreakpoint(mergedOptions.target);

    if (
      !breakpoint ||
      !mergedOptions.onlyBreakpointChange ||
      (mergedOptions.onlyBreakpointChange && breakpoint !== newBreakpoint)
    ) {
      breakpoint = newBreakpoint;

      func.call(result, {
        breakpoint,
        ...entries[0],
      });
    }
  });

  resizeObserver.observe(mergedOptions.target);

  result.unwatch = () => {
    resizeObserver.unobserve(mergedOptions.target);
  };

  return result;
};

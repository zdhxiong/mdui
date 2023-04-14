import { uniqueId } from './uniqueId.js';

export interface ObserveResize {
  /**
   * 取消监听
   */
  unobserve: () => void;
}

type Callback = (
  this: ObserveResize,
  entry: ResizeObserverEntry,
  observer: ObserveResize,
) => void;

interface CallbackOptions {
  /**
   * 执行的回调函数。`this` 指向监听的元素
   */
  callback: Callback;

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
 * @param callback 尺寸变化时执行的回调函数，`this` 指向监听的元素
 */
export const observeResize = (
  target: HTMLElement,
  callback: Callback,
): ObserveResize => {
  const key = uniqueId();

  // 取消监听函数
  const result: ObserveResize = {
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
          co.callback.call(result, entry, result);
        });
      });
    });
  }

  // 添加监听
  observer.observe(target);
  const coArr = weakMap.get(target) ?? [];
  coArr.push({ callback, key });
  weakMap.set(target, coArr);

  return result;
};

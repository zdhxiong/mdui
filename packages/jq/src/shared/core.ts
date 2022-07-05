import { PlainObject, eachArray } from './helper.js';

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
export class JQ<T = HTMLElement> implements ArrayLike<T> {
  length = 0;
  [index: number]: T;

  constructor(arr?: ArrayLike<T>) {
    if (!arr) {
      return this;
    }

    eachArray(arr, (item, i) => {
      this[i] = item;
    });

    this.length = arr.length;

    return this;
  }
}

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
export interface JQStatic {
  /**
   * 根据 HTML 字符串或 CSS 选择器创建 JQ 对象
   */
  <T extends HTMLElement = HTMLElement>(htmlOrSelector: string): JQ<T>;

  /**
   * HTMLSelectElement 是 Element, 也是 ArrayLike，JQ 把它视为 Element
   */
  (element: HTMLSelectElement): JQ<HTMLSelectElement>;

  /**
   * 根据 DOM 元素，DOM 元素数组创建 JQ 对象
   */
  <T extends Element>(element: T | ArrayLike<T>): JQ<T>;

  /**
   * 传入 JQ 对象，返回 JQ 对象
   */
  <T>(selection: JQ<T>): JQ<T>;

  /**
   * Document 加载完成后执行函数
   */
  <T = HTMLElement>(callback: (this: Document, $: JQStatic) => void): JQ<T>;

  /**
   * 传入键值对，返回含键值对的 JQ 对象
   */
  <T extends PlainObject>(object: T): JQ<T>;

  /**
   * 返回空的 JQ 对象
   */
  <T = HTMLElement>(): JQ<T>;

  // $.fn = JQ.prototype;
  fn: JQ<unknown>;

  // $ 命名空间上的静态方法
  [method: string]: unknown;
}

import { JQ } from '../JQ';
import PlainObject from './PlainObject';

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
export interface JQStatic {
  /**
   * 根据 HTML 字符串或 CSS 选择器创建 JQ 对象
   */
  (htmlOrSelector: string): JQ<HTMLElement>;

  /**
   * HTMLSelectElement 是 Element, 也是 ArrayLike，JQ 把它视为 Element
   */
  (element: HTMLSelectElement): JQ<HTMLSelectElement>;

  /**
   * 根据 DOM 元素或 DOM 元素数组创建 JQ 对象
   */
  <T extends Element>(elementOrElementArray: T | ArrayLike<T> | null): JQ<T>;

  /**
   * 传入 JQ 对象，返回 JQ 对象
   */
  <T>(selection: JQ<T>): JQ<T>;

  /**
   * 根据 CSS 选择器，HTML 字符串，DOM 元素，DOM 元素数组创建 JQ 对象
   */
  <T extends Element>(element: string | T | ArrayLike<T> | null): JQ<T>;

  /**
   * Document 加载完成后执行函数
   */
  (callback: (this: HTMLDocument, $: JQStatic) => void): JQ<HTMLDocument>;

  /**
   * 传入键值对，返回含键值对的 JQ 对象
   */
  <T extends PlainObject>(object: T): JQ<T>;

  /**
   * 返回空的 JQ 对象
   */
  <T = HTMLElement>(): JQ<T>;

  // $.fn = JQ.prototype;
  fn: any;

  // $ 命名空间上的静态方法
  [method: string]: Function;
}

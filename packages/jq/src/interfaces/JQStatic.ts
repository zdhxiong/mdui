import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
export interface JQStatic {
  /**
   * Document 加载完成后执行函数
   */
  (callback: (this: HTMLDocument, $: JQStatic) => void): JQ<HTMLDocument>;

  /**
   * 传入 window 作为参数
   */
  (window: Window): JQ<Window>;

  /**
   * 传入 document 作为参数
   */
  (document: HTMLDocument): JQ<HTMLDocument>;

  /**
   * 传入其他参数，可以是 HTML 字符串、CSS 选择器、JQ 对象、DOM 元素、DOM 元素数组、NodeList 等
   */
  (selector?: JQSelector): JQ<HTMLElement>;

  // $.fn = JQ.prototype;
  fn: any;

  // $ 命名空间上的静态方法
  [method: string]: Function;
}

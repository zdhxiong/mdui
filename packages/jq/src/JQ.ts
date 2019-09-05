import JQElement from './types/JQElement';
import { isDocument, isElement, isWindow } from './utils';
import each from './functions/each';
import map from './functions/map';

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
export class JQ<T = JQElement> implements ArrayLike<T> {
  length = 0;
  [index: number]: T;

  constructor(arr?: ArrayLike<Node | Window | null | undefined>) {
    if (!arr) {
      return this;
    }

    // 仅保留 HTMLElement、HTMLDocument 和 Window 元素
    const elements = map(arr, element => {
      if (isWindow(element) || isDocument(element) || isElement(element)) {
        return element;
      }

      return null;
    });

    each(elements, (i, element) => {
      // @ts-ignore
      this[i] = element;
    });

    this.length = elements.length;

    return this;
  }
}

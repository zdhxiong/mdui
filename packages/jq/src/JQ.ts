import each from './functions/each';

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

    each(arr, (i, item) => {
      // @ts-ignore
      this[i] = item;
    });

    this.length = arr.length;

    return this;
  }
}

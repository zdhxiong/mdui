/**
 * 键名为字符串的对象
 */
export type PlainObject<T = any> = {
  [key: string]: T;
};

/**
 * HTML 字符串类型
 */
export type HTMLString = string;

/**
 * CSS 选择器类型
 */
export type Selector = string;

/**
 * 一个类型、或该类型组成的数组
 */
export type TypeOrArray<T> = T | ArrayLike<T>;

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

    eachArray(arr, (i, item) => {
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
  (htmlOrSelector: string): JQ;

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

export const isNodeName = (element: Element, name: string): boolean => {
  return element.nodeName.toLowerCase() === name.toLowerCase();
};

export const isFunction = (target: any): target is Function => {
  return typeof target === 'function';
};

export const isString = (target: any): target is string => {
  return typeof target === 'string';
};

export const isNumber = (target: any): target is number => {
  return typeof target === 'number';
};

export const isBoolean = (target: any): target is boolean => {
  return typeof target === 'boolean';
};

export const isUndefined = (target: any): target is undefined => {
  return typeof target === 'undefined';
};

export const isNull = (target: any): target is null => {
  return target === null;
};

export const isWindow = (target: any): target is Window => {
  return target instanceof Window;
};

export const isDocument = (target: any): target is Document => {
  return target instanceof Document;
};

export const isElement = (target: any): target is Element => {
  return target instanceof Element;
};

export const isNode = (target: any): target is Node => {
  return target instanceof Node;
};

export const isArrayLike = (target: any): target is ArrayLike<any> => {
  return !isFunction(target) && !isWindow(target) && isNumber(target.length);
};

export const isObjectLike = (target: any): target is Record<string, any> => {
  return typeof target === 'object' && target !== null;
};

export const toElement = (target: Element | Document): Element => {
  return isDocument(target) ? target.documentElement : target;
};

/**
 * 把用 - 分隔的字符串转为驼峰（如 box-sizing 转换为 boxSizing）
 * @param string
 */
export const toCamelCase = (string: string): string => {
  return string.replace(/-([a-z])/g, (_, letter: string) => {
    return letter.toUpperCase();
  });
};

/**
 * 把驼峰法转为用 - 分隔的字符串（如 boxSizing 转换为 box-sizing）
 * @param string
 */
export const toKebabCase = (string: string): string => {
  return string.replace(/[A-Z]/g, (replacer) => {
    return '-' + replacer.toLowerCase();
  });
};

/**
 * 始终返回 false 的函数
 */
export const returnFalse = (): boolean => {
  return false;
};

/**
 * 遍历数组
 * @param target
 * @param callback
 */
export const eachArray = <T>(
  target: ArrayLike<T>,
  callback: (this: T, index: number, value: T) => any | void,
): ArrayLike<T> => {
  for (let i = 0; i < target.length; i += 1) {
    if (callback.call(target[i], i, target[i]) === false) {
      return target;
    }
  }

  return target;
};

/**
 * 遍历对象
 * @param target
 * @param callback
 */
export const eachObject = <T extends PlainObject, K extends keyof T>(
  target: T,
  callback: (this: T[K], key: K, value: T[K]) => any | void,
): T => {
  const keys = Object.keys(target) as K[];
  for (let i = 0; i < keys.length; i += 1) {
    if (callback.call(target[keys[i]], keys[i], target[keys[i]]) === false) {
      return target;
    }
  }

  return target;
};

import {
  PlainObject,
  eachObject,
  toCamelCase,
  eachArray,
  isUndefined,
  isString,
} from './core.js';

type ElementTarget = Element | Document | Window;

const weakMap = new WeakMap();

/**
 * 获取元素上的所有数据
 * @param element
 */
export const getAll = (element: ElementTarget): PlainObject => {
  return weakMap.get(element) ?? {};
};

/**
 * 获取元素上的的一个数据
 * @param element
 * @param keyOriginal
 */
export const get = (element: ElementTarget, keyOriginal: string) => {
  const data = getAll(element);
  const key = toCamelCase(keyOriginal);

  return key in data ? data[key] : undefined;
};

/**
 * 在上设置键值对数据
 * @param element
 * @param object
 */
export const setAll = (element: ElementTarget, object: PlainObject) => {
  const data = getAll(element);

  eachObject(object, (keyOriginal: string, value) => {
    data[toCamelCase(keyOriginal)] = value;
  });

  weakMap.set(element, data);
};

/**
 * 在元素上设置一个数据
 * @param element
 * @param keyOriginal
 * @param value
 */
export const set = (
  element: ElementTarget,
  keyOriginal: string,
  value: any,
) => {
  setAll(element, { [keyOriginal]: value });
};

/**
 * 移除元素上所有数据
 * @param element
 */
export const removeAll = (element: ElementTarget) => {
  weakMap.delete(element);
};

/**
 * 移除元素上的多个数据
 * @param element
 * @param keysOriginal 键名组成的数组
 */
export const removeMultiple = (
  element: ElementTarget,
  keysOriginal: ArrayLike<string>,
) => {
  const data = getAll(element);

  eachArray(keysOriginal, (_, keyOriginal) => {
    const key = toCamelCase(keyOriginal);
    delete data[key];
  });

  weakMap.set(element, data);
};

const rbrace = /^(?:{[\w\W]*\}|\[[\w\W]*\])$/;

/**
 * dataset 中的值读取时进行转换
 * @param value
 */
const stringTransform = (value: string) => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null') {
    return null;
  }

  if (value === +value + '') {
    return +value;
  }

  if (rbrace.test(value)) {
    return JSON.parse(value);
  }

  return value;
};

// 若 value 不存在，则从 `dataset` 中获取值。key 需要自行转为驼峰法
export const dataAttr = (element: HTMLElement, key: string, value?: any) => {
  if (isUndefined(value) && element.nodeType === 1) {
    value = element.dataset[key];

    if (isString(value)) {
      try {
        value = stringTransform(value);
      } catch (e) {}
    }
  }

  return value;
};

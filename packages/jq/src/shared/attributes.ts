import { isNull } from './helper.js';

/**
 * 获取属性值
 * @param element
 * @param key 属性键名
 * @param defaultValue 当 element.getAttribute 为 null 时，默认返回 undefined
 */
export const getAttribute = (
  element: Element,
  key: string,
  defaultValue?: unknown,
): unknown => {
  const value = element.getAttribute(key);

  return isNull(value) ? defaultValue : value;
};

/**
 * 移除属性
 * @param element
 * @param key 属性键名
 */
export const removeAttribute = (element: Element, key: string): void => {
  element.removeAttribute(key);
};

/**
 * 设置属性值
 * @param element
 * @param key 属性键名
 * @param value 值，若为 null，则调用 removeAttribute
 */
export const setAttribute = (
  element: Element,
  key: string,
  value: string | null,
): void => {
  if (isNull(value)) {
    removeAttribute(element, key);
  } else {
    element.setAttribute(key, value);
  }
};

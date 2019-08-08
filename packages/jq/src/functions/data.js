import dataNS from './utils/data';
import { isObjectLike } from '../utils';
import each from './each';

/**
 * 在指定元素上存储数据，或从指定元素上读取数据
 * @param elem 必须， DOM 元素
 * @param key 必须，键名
 * @param value 可选，值
 */
export default function data(elem, key, value) {
  let storage = {};

  if (value !== undefined) {
    // 根据 key、value 设置值
    storage[key] = value;
  } else if (isObjectLike(key)) {
    // 根据键值对设置值
    storage = key;
  } else if (key === undefined) {
    // 获取所有值
    const result = {};

    each(elem.attributes, (i, attribute) => {
      const { name } = attribute;

      if (name.indexOf('data-') === 0) {
        const prop = name.slice(5).replace(/-./g, u => u.charAt(1).toUpperCase());

        result[prop] = attribute.value;
      }
    });

    if (elem[dataNS]) {
      each(elem[dataNS], (k, v) => {
        result[k] = v;
      });
    }

    return result;
  } else if (elem[dataNS] && (key in elem[dataNS])) {
    // 获取指定值
    return elem[dataNS][key];
  } else {
    // 从 data- 中获取指定值
    const dataKey = elem.getAttribute(`data-${key}`);

    if (dataKey) {
      return dataKey;
    }

    return undefined;
  }

  // 设置值
  if (!elem[dataNS]) {
    elem[dataNS] = {};
  }

  each(storage, (k, v) => {
    elem[dataNS][k] = v;
  });

  return undefined;
}

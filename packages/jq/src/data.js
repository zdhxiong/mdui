import $ from './$';
import {
  each,
  isObjectLike,
} from './utils';

const dataNS = 'mduiElementDataStorage';

$.extend({
  /**
   * 在指定元素上存储数据，或从指定元素上读取数据
   * @param elem 必须， DOM 元素
   * @param key 必须，键名
   * @param value 可选，值
   */
  data(elem, key, value) {
    let data = {};

    if (value !== undefined) {
      // 根据 key、value 设置值
      data[key] = value;
    } else if (isObjectLike(key)) {
      // 根据键值对设置值
      data = key;
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

    each(data, (k, v) => {
      elem[dataNS][k] = v;
    });

    return undefined;
  },

  /**
   * 移除指定元素上存放的数据
   * @param elem 必须，DOM 元素
   * @param key 必须，键名
   */
  removeData(elem, key) {
    if (elem[dataNS] && elem[dataNS][key]) {
      elem[dataNS][key] = null;
      delete elem[dataNS][key];
    }
  },
});

$.fn.extend({
  /**
   * 在元素上读取或设置数据
   * @param key 必须
   * @param value
   * @returns {*}
   */
  data(key, value) {
    if (value === undefined) {
      if (isObjectLike(key)) {
        // 同时设置多个值
        return this.each((i, elem) => {
          $.data(elem, key);
        });
      }

      if (this[0]) {
        // 获取值
        return $.data(this[0], key);
      }

      return undefined;
    }

    // 设置值
    return this.each((i, elem) => {
      $.data(elem, key, value);
    });
  },

  /**
   * 移除元素上存储的数据
   * @param key 必须
   * @returns {*}
   */
  removeData(key) {
    return this.each((i, elem) => {
      $.removeData(elem, key);
    });
  },
});

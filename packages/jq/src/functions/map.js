import each from './each';

/**
 * 遍历数组或对象，通过函数返回一个新的数组或对象，null 和 undefined 将被过滤掉。
 * @param elements
 * @param callback
 * @returns {Array}
 */
export default function map(elements, callback) {
  let value;
  const ret = [];

  each(elements, (i, element) => {
    value = callback(element, i);

    if (value !== null && value !== undefined) {
      ret.push(value);
    }
  });

  return [].concat(...ret);
}

import each from './each';

/**
 * 删除数组中重复元素
 * @param arr {Array}
 * @returns {Array}
 */
export default function unique(arr) {
  const result = [];

  each(arr, (i, val) => {
    if (result.indexOf(val) === -1) {
      result.push(val);
    }
  });

  return result;
}

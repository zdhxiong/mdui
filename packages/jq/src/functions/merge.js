import each from './each';

/**
 * 把对象合并到第一个参数中，并返回第一个参数
 * @param first
 * @param second
 * @returns {*}
 */
export default function merge(first, second) {
  each(second, (i, val) => {
    first.push(val);
  });

  return first;
}

import { isArrayLike } from '../utils';

/**
 * 循环数组或对象
 * @param obj
 * @param callback
 * @returns {*}
 */
export default function each(obj, callback) {
  if (isArrayLike(obj)) {
    for (let i = 0; i < obj.length; i += 1) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        return obj;
      }
    }
  } else {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      if (callback.call(obj[keys[i]], keys[i], obj[keys[i]]) === false) {
        return obj;
      }
    }
  }

  return obj;
}

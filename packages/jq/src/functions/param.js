import { isObjectLike } from '../utils';
import each from './each';

/**
 * 将数组或对象序列化
 * @param obj
 * @returns {String}
 */
export default function param(obj) {
  if (!isObjectLike(obj)) {
    return '';
  }

  const args = [];

  function destructure(key, value) {
    let keyTmp;

    if (isObjectLike(value)) {
      each(value, (i, v) => {
        if (Array.isArray(value) && !isObjectLike(v)) {
          keyTmp = '';
        } else {
          keyTmp = i;
        }

        destructure(`${key}[${keyTmp}]`, v);
      });
    } else {
      if (value !== null && value !== '') {
        keyTmp = `=${encodeURIComponent(value)}`;
      } else {
        keyTmp = '';
      }

      args.push(encodeURIComponent(key) + keyTmp);
    }
  }

  each(obj, destructure);

  return args.join('&');
}

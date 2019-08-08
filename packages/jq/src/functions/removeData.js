import dataNS from './utils/data';

/**
 * 移除指定元素上存放的数据
 * @param elem 必须，DOM 元素
 * @param key 必须，键名
 */
export default function removeData(elem, key) {
  if (elem[dataNS] && elem[dataNS][key]) {
    elem[dataNS][key] = null;
    delete elem[dataNS][key];
  }
}

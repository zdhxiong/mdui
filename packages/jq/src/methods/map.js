import JQ from '../JQ';
import $ from '../$';
import map from '../functions/map';

/**
 * 通过遍历集合中的节点对象，通过函数返回一个新的对象，null 或 undefined 将被过滤掉。
 */
$.fn.map = function (callback) {
  return new JQ(map(this, (el, i) => callback.call(el, i, el)));
};

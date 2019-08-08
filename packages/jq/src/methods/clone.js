import $ from '../$';
import './map';

/**
 * 通过深度克隆来复制集合中的所有元素。
 * (通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和jquery中利用一个参数来确定是否复制数据和事件处理不相同。)
 * @returns {JQ}
 */
$.fn.clone = function () {
  return this.map(function () {
    return this.cloneNode(true);
  });
};

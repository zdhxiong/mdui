import JQ from '../JQ';
import $ from '../$';
import each from '../functions/each';
import unique from '../functions/unique';
import './each';

/**
 * 找到直接子元素的元素集合
 * @param selector {String=}
 * @returns {JQ}
 */
$.fn.children = function (selector) {
  const children = [];

  this.each((_, _this) => {
    each(_this.childNodes, (__, childNode) => {
      if (childNode.nodeType !== 1) {
        return;
      }

      if (!selector || (selector && $(childNode).is(selector))) {
        children.push(childNode);
      }
    });
  });

  return new JQ(unique(children));
};

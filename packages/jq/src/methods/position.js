import $ from '../$';
import { isNodeName } from '../utils';
import './css';
import './offset';
import './offsetParent';

/**
 * 获取元素相对于父元素的偏移
 * @return {Object}
 */
$.fn.position = function () {
  const self = this;

  if (!self[0]) {
    return null;
  }

  let offsetParent;
  let offset;
  let parentOffset = {
    top: 0,
    left: 0,
  };

  if (self.css('position') === 'fixed') {
    offset = self[0].getBoundingClientRect();
  } else {
    offsetParent = self.offsetParent();
    offset = self.offset();
    if (!isNodeName(offsetParent[0], 'html')) {
      parentOffset = offsetParent.offset();
    }

    parentOffset = {
      top: parentOffset.top + offsetParent.css('borderTopWidth'),
      left: parentOffset.left + offsetParent.css('borderLeftWidth'),
    };
  }

  return {
    top: offset.top - parentOffset.top - self.css('marginTop'),
    left: offset.left - parentOffset.left - self.css('marginLeft'),
    width: offset.width,
    height: offset.height,
  };
};

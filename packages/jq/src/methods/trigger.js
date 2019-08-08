// import 'mdn-polyfills/MouseEvent';
// import 'mdn-polyfills/CustomEvent';
import $ from '../$';
import './each';

/**
 * 触发一个事件
 * @param eventName
 * @param data
 * @returns {*|JQ}
 */
$.fn.trigger = function (eventName, data) {
  const isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;
  let evt;

  if (isMouseEvent) {
    // Note: MouseEvent 无法传入 detail 参数
    evt = new MouseEvent(eventName, {
      bubbles: true,
      cancelable: true,
    });
  } else {
    evt = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  evt._detail = data;

  return this.each(function () {
    this.dispatchEvent(evt);
  });
};

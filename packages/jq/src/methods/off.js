import $ from '../$';
import { isString, isFunction } from '../utils';
import { fnFalse, remove } from './utils/event';
import each from '../functions/each';
import './each';

/**
 * 取消绑定事件
 *
 * $().off(eventName, selector);
 * $().off(eventName, callback);
 * $().off(eventName, false);
 */
$.fn.off = function (eventName, selector, callback) {
  const self = this;

  // event 使用 事件:函数 键值对
  // event = {
  //   'event1': callback1,
  //   'event2': callback2
  // }
  //
  // $().off(event, selector)
  if (eventName && !isString(eventName)) {
    each(eventName, (type, fn) => {
      self.off(type, selector, fn);
    });

    return self;
  }

  // selector 不存在
  // $().off(event, callback)
  if (!isString(selector) && !isFunction(callback) && callback !== false) {
    callback = selector;
    selector = undefined;
  }

  // callback 为 false
  // $().off(event, false)
  if (callback === false) {
    callback = fnFalse;
  }

  return self.each(function () {
    remove(this, eventName, callback, selector);
  });
};

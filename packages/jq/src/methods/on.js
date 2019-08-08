import $ from '../$';
import { isString, isFunction } from '../utils';
import { fnFalse, add } from './utils/event';
import each from '../functions/each';
import './off';
import './each';

/**
 * 绑定事件
 *
 * $().on({eventName: fn}, selector, data);
 * $().on({eventName: fn}, selector)
 * $().on({eventName: fn})
 * $().on(eventName, selector, data, fn);
 * $().on(eventName, selector, fn);
 * $().on(eventName, data, fn);
 * $().on(eventName, fn);
 * $().on(eventName, false);
 *
 * @param eventName
 * @param selector
 * @param data
 * @param callback
 * @param one 是否是 one 方法，只在 JQ 内部使用
 * @returns
 */
$.fn.on = function (eventName, selector, data, callback, one) {
  const self = this;

  // 默认
  // $().on(event, selector, data, callback)

  // event 使用 事件:函数 键值对
  // event = {
  //   'event1': callback1,
  //   'event2': callback2
  // }
  //
  // $().on(event, selector, data)
  if (eventName && !isString(eventName)) {
    each(eventName, (type, fn) => {
      self.on(type, selector, data, fn);
    });

    return self;
  }

  // selector 不存在
  // $().on(event, data, callback)
  if (!isString(selector) && !isFunction(callback) && callback !== false) {
    callback = data;
    data = selector;
    selector = undefined;
  }

  // data 不存在
  // $().on(event, callback)
  if (isFunction(data) || data === false) {
    callback = data;
    data = undefined;
  }

  // callback 为 false
  // $().on(event, false)
  if (callback === false) {
    callback = fnFalse;
  }

  if (one === 1) {
    const origCallback = callback;
    callback = function () {
      self.off(eventName, selector, callback);
      /* eslint prefer-rest-params: 0 */
      return origCallback.apply(this, arguments);
    };
  }

  return this.each(function () {
    add(this, eventName, callback, data, selector);
  });
};

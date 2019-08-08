import $ from '../$';
import { isString } from '../utils';
import each from '../functions/each';
import './on';

/**
 * 绑定事件，只触发一次
 * @param eventName
 * @param selector
 * @param data
 * @param callback
 */
$.fn.one = function (eventName, selector, data, callback) {
  const self = this;

  if (!isString(eventName)) {
    each(eventName, (type, fn) => {
      type.split(' ').forEach((eName) => {
        self.on(eName, selector, data, fn, 1);
      });
    });
  } else {
    eventName.split(' ').forEach((eName) => {
      self.on(eName, selector, data, callback, 1);
    });
  }

  return this;
};

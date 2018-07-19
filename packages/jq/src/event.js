import 'mdn-polyfills/MouseEvent';
import 'mdn-polyfills/CustomEvent';
import $ from './$';
import {
  each,
  isFunction,
  isString,
  isObjectLike,
} from './utils';

// 存储事件
const handlers = {
  // i: { // 元素ID
  //   j: { // 事件ID
  //     e: 事件名
  //     fn: 事件处理函数
  //     i: 事件ID
  //     proxy:
  //     sel: 选择器
  //   }
  // }
};

// 元素ID
let mduiElementId = 1;

function fnFalse() {
  return false;
}

/**
 * 为元素赋予一个唯一的ID
 * @param element
 * @returns {number|*}
 */
function getElementId(element) {
  if (!element.mduiElementId) {
    mduiElementId += 1;
    element.mduiElementId = mduiElementId;
  }

  return element.mduiElementId;
}

/**
 * 获取匹配的事件
 * @param element
 * @param eventName
 * @param func
 * @param selector
 * @returns {Array}
 */
function getHandlers(element, eventName, func, selector) {
  return (handlers[getElementId(element)] || []).filter(handler => handler
    && (!eventName || handler.e === eventName)
    && (!func || handler.fn.toString() === func.toString())
    && (!selector || handler.sel === selector));
}

/**
 * 添加事件监听
 * @param element
 * @param eventName
 * @param func
 * @param data
 * @param selector
 */
function add(element, eventName, func, data, selector) {
  const elementId = getElementId(element);

  if (!handlers[elementId]) {
    handlers[elementId] = [];
  }

  // 传入 data.useCapture 来设置 useCapture: true
  let useCapture = false;
  if (isObjectLike(data) && data.useCapture) {
    useCapture = true;
  }

  eventName.split(' ').forEach((event) => {
    const handler = {
      e: event,
      fn: func,
      sel: selector,
      i: handlers[elementId].length,
    };

    function callFn(e, elem) {
      // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
      /* eslint no-underscore-dangle: 0 */
      const result = func.apply(elem, e._detail === undefined ? [e] : [e].concat(e._detail));

      if (result === false) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function proxyfn(e) {
      e._data = data;

      if (selector) {
        // 事件代理
        $(element)
          .find(selector)
          .get()
          .reverse()
          .forEach((elem) => {
            if (elem === e.target || $.contains(elem, e.target)) {
              callFn(e, elem);
            }
          });
      } else {
        // 不使用事件代理
        callFn(e, element);
      }
    }

    handler.proxy = proxyfn;
    handlers[elementId].push(handler);
    element.addEventListener(handler.e, proxyfn, useCapture);
  });
}

/**
 * 移除事件监听
 * @param element
 * @param eventName
 * @param func
 * @param selector
 */
function remove(element, eventName, func, selector) {
  (eventName || '').split(' ').forEach((event) => {
    getHandlers(element, event, func, selector).forEach((handler) => {
      delete handlers[getElementId(element)][handler.i];
      element.removeEventListener(handler.e, handler.proxy, false);
    });
  });
}

$.fn.extend({
  /**
   * DOM 加载完毕后调用的函数
   * @param callback
   * @returns {ready}
   */
  ready(callback) {
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
      callback($);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        callback($);
      }, false);
    }

    return this;
  },

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
  on(eventName, selector, data, callback, one) {
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
  },

  /**
   * 绑定事件，只触发一次
   * @param eventName
   * @param selector
   * @param data
   * @param callback
   */
  one(eventName, selector, data, callback) {
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
  },

  /**
   * 取消绑定事件
   *
   * $().off(eventName, selector);
   * $().off(eventName, callback);
   * $().off(eventName, false);
   *
   */
  off(eventName, selector, callback) {
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
  },

  /**
   * 触发一个事件
   * @param eventName
   * @param data
   * @returns {*|JQ}
   */
  trigger(eventName, data) {
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

    evt._detail = data;

    return this.each(function () {
      this.dispatchEvent(evt);
    });
  },
});

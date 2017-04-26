(function () {
  // 存储事件
  var handlers = {
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
  var _elementId = 1;

  var fnFalse = function () {
    return false;
  };

  $.fn.extend({
    /**
     * DOM 加载完毕后调用的函数
     * @param callback
     * @returns {ready}
     */
    ready: function (callback) {
      if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
        callback($);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
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
    on: function (eventName, selector, data, callback, one) {
      var _this = this;

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
        each(eventName, function (type, fn) {
          _this.on(type, selector, data, fn);
        });

        return _this;
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
        var origCallback = callback;
        callback = function () {
          _this.off(eventName, selector, callback);
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
    one: function (eventName, selector, data, callback) {
      var _this = this;

      if (!isString(eventName)) {
        each(eventName, function (type, fn) {
          type.split(' ').forEach(function (eName) {
            _this.on(eName, selector, data, fn, 1);
          });
        });
      } else {
        eventName.split(' ').forEach(function (eName) {
          _this.on(eName, selector, data, callback, 1);
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
    off: function (eventName, selector, callback) {
      var _this = this;

      // event 使用 事件:函数 键值对
      // event = {
      //   'event1': callback1,
      //   'event2': callback2
      // }
      //
      // $().off(event, selector)
      if (eventName && !isString(eventName)) {
        each(eventName, function (type, fn) {
          _this.off(type, selector, fn);
        });

        return _this;
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

      return _this.each(function () {
        remove(this, eventName, callback, selector);
      });
    },

    /**
     * 触发一个事件
     * @param eventName
     * @param data
     * @returns {*|JQ}
     */
    trigger: function (eventName, data) {
      if (!isString(eventName)) {
        return;
      }

      var evt;
      try {
        evt = new CustomEvent(eventName, { detail: data, bubbles: true, cancelable: true });
      } catch (e) {
        evt = document.createEvent('Event');
        evt.initEvent(eventName, true, true);
        evt.detail = data;
      }

      evt._data = data;

      return this.each(function () {
        this.dispatchEvent(evt);
      });
    },
  });

  /**
   * 添加事件监听
   * @param element
   * @param eventName
   * @param func
   * @param data
   * @param selector
   */
  function add(element, eventName, func, data, selector) {
    var elementId = getElementId(element);
    if (!handlers[elementId]) {
      handlers[elementId] = [];
    }

    // 传入 data.useCapture 来设置 useCapture: true
    var useCapture = false;
    if (isObjectLike(data) && data.useCapture) {
      useCapture = true;
    }

    eventName.split(' ').forEach(function (event) {

      var handler = {
        e: event,
        fn: func,
        sel: selector,
        i: handlers[elementId].length,
      };

      var callFn = function (e, ele) {
        var result = func.apply(ele, e._data === undefined ? [e] : [e].concat(e._data));
        if (result === false) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      var proxyfn = handler.proxy = function (e) {
        e.data = data;

        // 事件代理
        if (selector) {
          $(element).find(selector).get().reverse().forEach(function (ele) {
            if (ele === e.target || $.contains(ele, e.target)) {
              callFn(e, ele);
            }
          });
        }

        // 不使用事件代理
        else {
          callFn(e, element);
        }
      };

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
    (eventName || '').split(' ').forEach(function (event) {
      getHandlers(element, event, func, selector).forEach(function (handler) {
        delete handlers[getElementId(element)][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  /**
   * 为元素赋予一个唯一的ID
   * @param element
   * @returns {number|*}
   */
  function getElementId(element) {
    return element._elementId || (element._elementId = _elementId++);
  }

  /**
   * 获取匹配的事件
   * @param element
   * @param eventName
   * @param func
   * @param selector
   * @returns {Array.<T>}
   */
  function getHandlers(element, eventName, func, selector) {
    return (handlers[getElementId(element)] || []).filter(function (handler) {

      return handler &&
        (!eventName  || handler.e === eventName) &&
        (!func || handler.fn.toString() === func.toString()) &&
        (!selector || handler.sel === selector);
    });
  }

})();

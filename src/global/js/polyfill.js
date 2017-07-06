/**
 * =============================================================================
 * ************   浏览器兼容性问题修复   ************
 * =============================================================================
 */

/**
 * requestAnimationFrame
 * cancelAnimationFrame
 */
(function () {
  var lastTime = 0;

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));

      var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();

/**
 * 修复 IE 浏览器不支持 CustomEvent
 */
(function () {
  if (typeof window.CustomEvent === 'function') {
    return false;
  }

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

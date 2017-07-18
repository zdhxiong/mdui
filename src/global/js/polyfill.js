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

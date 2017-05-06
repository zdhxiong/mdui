/**
 * =============================================================================
 * ************   定义全局变量   ************
 * =============================================================================
 */

var $document = $(document);
var $window = $(window);

/**
 * 队列 -- 当前队列的 api 和 jquery 不一样，所以不打包进 mdui.JQ 里
 */
var queue = {};
(function () {
  var queueData = [];

  /**
   * 写入队列
   * @param queueName 对列名
   * @param func 函数名，该参数为空时，返回所有队列
   */
  queue.queue = function (queueName, func) {
    if (queueData[queueName] === undefined) {
      queueData[queueName] = [];
    }

    if (func === undefined) {
      return queueData[queueName];
    }

    queueData[queueName].push(func);
  };

  /**
   * 从队列中移除第一个函数，并执行该函数
   * @param queueName
   */
  queue.dequeue = function (queueName) {
    if (queueData[queueName] !== undefined && queueData[queueName].length) {
      (queueData[queueName].shift())();
    }
  };

})();

/**
 * touch 事件后的 500ms 内禁用 mousedown 事件
 *
 * 不支持触控的屏幕上事件顺序为 mousedown -> mouseup -> click
 * 支持触控的屏幕上事件顺序为 touchstart -> touchend -> mousedown -> mouseup -> click
 */
var TouchHandler = {
  touches: 0,

  /**
   * 该事件是否被允许
   * 在执行事件前调用该方法判断事件是否可以执行
   * @param e
   * @returns {boolean}
   */
  isAllow: function (e) {
    var allow = true;

    if (
      TouchHandler.touches &&
      [
        'mousedown',
        'mouseup',
        'mousemove',
        'click',
        'mouseover',
        'mouseout',
        'mouseenter',
        'mouseleave',
      ].indexOf(e.type) > -1
    ) {
      // 触发了 touch 事件后阻止鼠标事件
      allow = false;
    }

    return allow;
  },

  /**
   * 在 touchstart 和 touchmove、touchend、touchcancel 事件中调用该方法注册事件
   * @param e
   */
  register: function (e) {
    if (e.type === 'touchstart') {
      // 触发了 touch 事件
      TouchHandler.touches += 1;
    } else if (['touchmove', 'touchend', 'touchcancel'].indexOf(e.type) > -1) {
      // touch 事件结束 500ms 后解除对鼠标事件的阻止
      setTimeout(function () {
        if (TouchHandler.touches) {
          TouchHandler.touches -= 1;
        }
      }, 500);
    }
  },

  start: 'touchstart mousedown',
  move: 'touchmove mousemove',
  end: 'touchend mouseup',
  cancel: 'touchcancel mouseleave',
  unlock: 'touchend touchmove touchcancel',
};

// 测试事件
// 在每一个事件中都使用 TouchHandler.isAllow(e) 判断事件是否可执行
// 在 touchstart 和 touchmove、touchend、touchcancel
// (function () {
//
//   $document
//     .on(TouchHandler.start, function (e) {
//       if (!TouchHandler.isAllow(e)) {
//         return;
//       }
//       TouchHandler.register(e);
//       console.log(e.type);
//     })
//     .on(TouchHandler.move, function (e) {
//       if (!TouchHandler.isAllow(e)) {
//         return;
//       }
//       console.log(e.type);
//     })
//     .on(TouchHandler.end, function (e) {
//       if (!TouchHandler.isAllow(e)) {
//         return;
//       }
//       console.log(e.type);
//     })
//     .on(TouchHandler.unlock, TouchHandler.register);
// })();

$(function () {
  // 避免页面加载完后直接执行css动画
  // https://css-tricks.com/transitions-only-after-page-load/

  setTimeout(function () {
    $('body').addClass('mdui-loaded');
  }, 0);
});

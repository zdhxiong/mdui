/**
 * =============================================================================
 * ************   开放的常用方法   ************
 * =============================================================================
 */

$.fn.extend({

  /**
   * 执行强制重绘
   */
  reflow: function () {
    return this.each(function () {
      return this.clientLeft;
    });
  },

  /**
   * 设置 transition 时间
   * @param duration
   */
  transition: function (duration) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms';
    }

    return this.each(function () {
      this.style.webkitTransitionDuration = duration;
      this.style.transitionDuration = duration;
    });
  },

  /**
   * transition 动画结束回调
   * @param callback
   * @returns {transitionEnd}
   */
  transitionEnd: function (callback) {
    var events = [
        'webkitTransitionEnd',
        'transitionend',
      ];
    var i;
    var _this = this;

    function fireCallBack(e) {
      if (e.target !== this) {
        return;
      }

      callback.call(this, e);

      for (i = 0; i < events.length; i++) {
        _this.off(events[i], fireCallBack);
      }
    }

    if (callback) {
      for (i = 0; i < events.length; i++) {
        _this.on(events[i], fireCallBack);
      }
    }

    return this;
  },

  /**
   * 设置 transform-origin 属性
   * @param transformOrigin
   */
  transformOrigin: function (transformOrigin) {
    return this.each(function () {
      this.style.webkitTransformOrigin = transformOrigin;
      this.style.transformOrigin = transformOrigin;
    });
  },

  /**
   * 设置 transform 属性
   * @param transform
   */
  transform: function (transform) {
    return this.each(function () {
      this.style.webkitTransform = transform;
      this.style.transform = transform;
    });
  },

});

$.extend({
  /**
   * 创建并显示遮罩
   * @param zIndex 遮罩层的 z-index
   */
  showOverlay: function (zIndex) {
    var $overlay = $('.mdui-overlay');

    if ($overlay.length) {
      $overlay.data('isDeleted', 0);

      if (zIndex !== undefined) {
        $overlay.css('z-index', zIndex);
      }
    } else {
      if (zIndex === undefined) {
        zIndex = 2000;
      }

      $overlay = $('<div class="mdui-overlay">')
        .appendTo(document.body)
        .reflow()
        .css('z-index', zIndex);
    }

    var level = $overlay.data('overlay-level') || 0;
    return $overlay
      .data('overlay-level', ++level)
      .addClass('mdui-overlay-show');
  },

  /**
   * 隐藏遮罩层
   * @param force 是否强制隐藏遮罩
   */
  hideOverlay: function (force) {
    var $overlay = $('.mdui-overlay');

    if (!$overlay.length) {
      return;
    }

    var level = force ? 1 : $overlay.data('overlay-level');
    if (level > 1) {
      $overlay.data('overlay-level', --level);
      return;
    }

    $overlay
      .data('overlay-level', 0)
      .removeClass('mdui-overlay-show')
      .data('isDeleted', 1)
      .transitionEnd(function () {
        if ($overlay.data('isDeleted')) {
          $overlay.remove();
        }
      });
  },

  /**
   * 锁定屏幕
   */
  lockScreen: function () {
    var $body = $('body');

    // 不直接把 body 设为 box-sizing: border-box，避免污染全局样式
    var newBodyWidth = $body.width();

    $body
      .addClass('mdui-locked')
      .width(newBodyWidth);

    var level = $body.data('lockscreen-level') || 0;
    $body.data('lockscreen-level', ++level);
  },

  /**
   * 解除屏幕锁定
   * @param force 是否强制解锁屏幕
   */
  unlockScreen: function (force) {
    var $body = $('body');

    var level = force ? 1 : $body.data('lockscreen-level');
    if (level > 1) {
      $body.data('lockscreen-level', --level);
      return;
    }

    $body
      .data('lockscreen-level', 0)
      .removeClass('mdui-locked')
      .width('');
  },

  /**
   * 函数节流
   * @param fn
   * @param delay
   * @returns {Function}
   */
  throttle: function (fn, delay) {
    var timer = null;
    if (!delay || delay < 16) {
      delay = 16;
    }

    return function () {
      var _this = this;
      var args = arguments;

      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(_this, args);
          timer = null;
        }, delay);
      }
    };
  },

  /**
   * 生成唯一 id
   * @param pluginName 插件名，若传入该参数，guid 将以该参数作为前缀
   * @returns {string}
   */
  guid: function (pluginName) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    var guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    if (pluginName) {
      guid = 'mdui-' + pluginName + '-' + guid;
    }

    return guid;
  },

});

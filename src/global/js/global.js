/**
 * 触摸或鼠标事件
 */
mdui.touchEvents = {
  start: mdui.support.touch ? 'touchstart' : 'mousedown',
  move: mdui.support.touch ? 'touchmove' : 'mousemove',
  end: mdui.support.touch ? 'touchend' : 'mouseup',
};

/**
 * 判断窗口大小
 */
mdui.screen = {
  xs: function () {
    return window.innerWidth < 600;
  },

  sm: function () {
    return window.innerWidth >= 600 && window.innerWidth < 1024;
  },

  md: function () {
    return window.innerWidth >= 1024 && window.innerWidth < 1440;
  },

  lg: function () {
    return window.innerWidth >= 1440 && window.innerWidth < 1920;
  },

  xl: function () {
    return window.innerWidth >= 1920;
  },

  xsDown: function () {
    return window.innerWidth < 600;
  },

  smDown: function () {
    return window.innerWidth < 1024;
  },

  mdDown: function () {
    return window.innerWidth < 1440;
  },

  lgDown: function () {
    return window.innerWidth < 1920;
  },

  xlDown: function () {
    return true;
  },

  xsUp: function () {
    return true;
  },

  smUp: function () {
    return window.innerWidth >= 600;
  },

  mdUp: function () {
    return window.innerWidth >= 1024;
  },

  lgUp: function () {
    return window.innerWidth >= 1440;
  },

  xlUp: function () {
    return window.innerWidth >= 1920;
  },

};

/**
 * 创建遮罩层并显示
 * @param zIndex 遮罩层的 z_index
 * @returns {Element}
 */
mdui.showOverlay = function (zIndex) {
  var overlay = $.dom('<div class="mdui-overlay">')[0];
  document.body.appendChild(overlay);

  $.relayout(overlay);

  if (typeof zIndex === 'undefined') {
    zIndex = 2000;
  }

  overlay.style['z-index'] = zIndex;
  overlay.classList.add('mdui-overlay-show');

  return overlay;
};

/**
 * 隐藏遮罩层
 * @param overlay 指定遮罩层元素，若没有该参数，则移除所有遮罩层
 */
mdui.hideOverlay = function (overlay) {
  var overlays;
  if (typeof overlay === 'undefined') {
    overlays = $.queryAll('.mdui-overlay');
  } else {
    overlays = [overlay];
  }

  $.each(overlays, function (i, overlay) {
    overlay.classList.remove('mdui-overlay-show');
    $.transitionEnd(overlay, function () {
      $.remove(overlay);
    });
  });
};

/**
 * 锁定屏幕
 */
mdui.lockScreen = function () {
  var body = document.body;
  var oldWindowWidth = body.clientWidth;

  // 不直接把 body 设为 box-sizing: border-box，避免污染全局样式
  var oldBodyPaddingLeft = parseFloat($.getStyle(body, 'padding-left'));
  var oldBodyPaddingRight = parseFloat($.getStyle(body, 'padding-right'));

  document.body.classList.add('mdui-locked');
  document.body.style.width = oldWindowWidth - oldBodyPaddingLeft - oldBodyPaddingRight + 'px';
};

/**
 * 解除屏幕锁定
 */
mdui.unlockScreen = function () {
  document.body.classList.remove('mdui-locked');
  document.body.style.width = '';
};

/**
 * 函数节流
 * @param fn
 * @param delay
 * @returns {Function}
 */
mdui.throttle = function (fn, delay) {
  var timer = null;

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
};

/**
 * 生成唯一 id
 * @param pluginName 插件名，若传入该参数，guid 将以该参数作为前缀
 * @returns {string}
 */
mdui.guid = function (pluginName) {
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
};

$.ready(function () {
  // 避免页面加载完后直接执行css动画
  // https://css-tricks.com/transitions-only-after-page-load/

  setTimeout(function () {
    document.body.classList.add('mdui-loaded');
  }, 0);

  // 支持触摸时在 body 添加 mdui-support-touch
  if (mdui.support.touch) {
    document.body.classList.add('mdui-support-touch');
  }

});

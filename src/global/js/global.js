/**
 * 触摸或鼠标事件
 * @type {{start: string, move: string, end: string}}
 */
mdui.touchEvents = {
  start: mdui.support.touch ? 'touchstart' : 'mousedown',
  move: mdui.support.touch ? 'touchmove' : 'mousemove',
  end: mdui.support.touch ? 'touchend' : 'mouseup'
};

/**
 * 判断窗口大小
 * @type {{xs: mdui.screen.xs, sm: mdui.screen.sm, md: mdui.screen.md, lg: mdui.screen.lg, xl: mdui.screen.xl, xsDown: mdui.screen.xsDown, smDown: mdui.screen.smDown, mdDown: mdui.screen.mdDown, lgDown: mdui.screen.lgDown, xlDown: mdui.screen.xlDown, xsUp: mdui.screen.xsUp, smUp: mdui.screen.smUp, mdUp: mdui.screen.mdUp, lgUp: mdui.screen.lgUp, xlUp: mdui.screen.xlUp}}
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
  }
};

/**
 * 创建遮罩层并显示
 * @param z_index 遮罩层的 z_index
 */
mdui.showMask = function (z_index) {
  var mask = $.query('.md-mask');
  if (!mask) {
    mask = $.dom('<div class="md-mask">')[0];
    document.body.appendChild(mask);

    //使动态添加的元素的 transition 动画能生效
    window.getComputedStyle(mask, null).getPropertyValue('opacity');
  }

  if (typeof z_index !== 'undefined') {
    mask.style['z-index'] = z_index;
    mask.classList.add('md-mask-show');
  }
};

/**
 * 隐藏遮罩层
 */
mdui.hideMask = function () {
  var mask = $.query('.md-mask');
  if (mask) {
    mask.classList.remove('md-mask-show');
  }
};

/**
 * 锁定屏幕
 */
mdui.lockScreen = function () {
  var oldBodyWidth = window.getComputedStyle(document.body).width;
  document.body.classList.add('md-locked');
  document.body.style.width = oldBodyWidth;
};

/**
 * 解除屏幕锁定
 */
mdui.unlockScreen = function () {
  document.body.classList.remove('md-locked');
  document.body.style.width = '';
};

$.ready(function () {
  // 避免页面加载完后直接执行css动画
  // https://css-tricks.com/transitions-only-after-page-load/

  var defaultDuration = '0.3s';
  var defaultTimeingFunction = 'cubic-bezier(0, 0, 0.2, 1)';
  var transitionTarget = {
    "body": "padding " + defaultDuration + " " + defaultTimeingFunction,
    ".md-drawer": "all " + defaultDuration + " " + defaultTimeingFunction,
    ".md-navbar": "all " + defaultDuration + " " + defaultTimeingFunction
  };
  $.each(transitionTarget, function (selector, transition) {
    $.each($.queryAll(selector), function (i, target) {
      target.style['-webkit-transition'] = transition;
      target.style['transition'] = transition;
    });
  });
});
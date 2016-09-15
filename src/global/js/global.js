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
 * @returns {Element}
 */
mdui.showMask = function (z_index) {
  var mask = $.dom('<div class="md-mask">')[0];
  document.body.appendChild(mask);

  //使动态添加的元素的 transition 动画能生效
  $.getStyle(mask, 'opacity');

  if (typeof z_index === 'undefined') {
    z_index = 100;
  }
  mask.style['z-index'] = z_index;
  mask.classList.add('md-mask-show');

  return mask;
};

/**
 * 隐藏遮罩层
 * @param mask 指定遮罩层元素，若没有该参数，则移除所有遮罩层
 */
mdui.hideMask = function (mask) {
  var masks;
  if(typeof mask === 'undefined'){
    masks = $.queryAll('.md-mask');
  }else{
    masks = [mask];
  }
  $.each(masks, function(i, mask){
    mask.classList.remove('md-mask-show');
    $.transitionEnd(mask, function(){
      mask.parentNode.removeChild(mask);
    });
  });
};

/**
 * 锁定屏幕
 */
mdui.lockScreen = function () {
  var oldBodyWidth = document.body.clientWidth + 'px';
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

/**
 * 函数节流
 * @param fn
 * @param delay
 * @param mustRunDelay
 * @returns {Function}
 */
mdui.throttle = function(fn, delay, mustRunDelay){
  var timer = null;
  var t_start;
  return function(){
    var context = this, args = arguments, t_curr = +new Date();
    clearTimeout(timer);
    if(!t_start){
      t_start = t_curr;
    }
    if(t_curr - t_start >= mustRunDelay){
      fn.apply(context, args);
      t_start = t_curr;
    }
    else {
      timer = setTimeout(function(){
        fn.apply(context, args);
      }, delay);
    }
  };
};

$.ready(function () {
  // 避免页面加载完后直接执行css动画
  // https://css-tricks.com/transitions-only-after-page-load/

  setTimeout(function(){
    document.body.classList.add('md-loaded');
  }, 0);

});
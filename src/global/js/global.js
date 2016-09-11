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
 * 根据窗口宽度判断是否是手机设备
 * @returns {boolean}
 *
 */
mdui.isPhone = function () {
  return window.innerWidth < 600;
};

/**
 * 根据窗口宽度判断是否是平板设备
 * @returns {boolean}
 */
mdui.isTablet = function () {
  return window.innerWidth < 1024 && window.innerWidth >= 600;
};

/**
 * 根据窗口宽度判断是否是桌面设备
 * @returns {boolean}
 */
mdui.isDesktop = function () {
  return window.innerWidth >= 1024;
};

/**
 * 创建遮罩层并显示
 * @param z_index 遮罩层的 z_index
 */
mdui.showMask = function (z_index) {
  var mask = $.query('.md-mask');
  if(!mask){
    mask = $.dom('<div class="md-mask">')[0];
    document.body.appendChild(mask);

    //使动态添加的元素的 transition 动画能生效
    window.getComputedStyle(mask, null).getPropertyValue('opacity');
  }

  if(typeof z_index !== 'undefined'){
    mask.style['z-index'] = z_index;
    mask.classList.add('md-mask-show');
  }
};

/**
 * 隐藏遮罩层
 */
mdui.hideMask = function () {
  var mask = $.query('.md-mask');
  if(mask){
    mask.classList.remove('md-mask-show');
  }
};

/**
 * 锁定屏幕
 */
mdui.lockScreen = function () {
  document.body.classList.add('md-locked');
};

/**
 * 解除屏幕锁定
 */
mdui.unlockScreen = function () {
  document.body.classList.remove('md-locked');
};

$.ready(function(){
  // 避免页面加载完后直接执行css动画
  // https://css-tricks.com/transitions-only-after-page-load/
  var transitionTarget = {
    "body": "padding 0.3s cubic-bezier(0, 0, 0.2, 1)",
    ".md-drawer": "all 0.3s cubic-bezier(0, 0, 0.2, 1)",
    ".md-navbar": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  };
  $.each(transitionTarget, function(selector, transition){
    $.each($.queryAll(selector), function(i, target){
      target.style['-webkit-transition'] = transition;
      target.style['transition'] = transition;
    });
  });
});
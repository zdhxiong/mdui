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
  return window.innerWidth < 480;
};

/**
 * 根据窗口宽度判断是否是平板设备
 * @returns {boolean}
 */
mdui.isTablet = function () {
  return window.innerWidth < 840 && window.innerWidth >= 480;
};

/**
 * 根据窗口宽度判断是否是桌面设备
 * @returns {boolean}
 */
mdui.isDesktop = function () {
  return window.innerWidth >= 840;
};

/**
 * 创建遮罩层并显示
 * @param z_index 遮罩层的 z_index
 */
mdui.showMask = function (z_index) {
  var mask = document.querySelector('.md-mask');
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
  var mask = document.querySelector('.md-mask');
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

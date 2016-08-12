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
  var $mask = $('.md-mask');

  if (!$mask.length) {
    $mask = $('<div>').addClass('md-mask');
    mdui.$body.append($mask);

    var _temp = window.getComputedStyle($mask[0]).opacity; //使动态添加的元素的 transition 动画能生效
  }

  if (z_index) {
    $mask.css('z-index', z_index);
  }

  $mask.addClass('md-mask-show');
};

/**
 * 隐藏遮罩层
 */
mdui.hideMask = function () {
  $('.md-mask').removeClass('md-mask-show');
};

/**
 * 锁定屏幕
 */
mdui.lockScreen = function () {
  $('html').addClass('md-locked');
};

/**
 * 解除屏幕锁定
 */
mdui.unlockScreen = function () {
  $('html').removeClass('md-locked');
};

/**
 * 设置 transform
 * @param dom
 * @param transform
 */
mdui.transform = function (dom, transform) {
  if (!(dom instanceof jQuery)) {
    dom = $(dom);
  }
  for (var i = 0; i < dom.length; i++) {
    var elStyle = dom[i].style;
    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
  }
};

/**
 * 设置 transition duration
 * @param dom
 * @param duration
 * @returns {mdui}
 */
mdui.transition = function (dom, duration) {
  if (!(dom instanceof jQuery)) {
    dom = $(dom);
  }
  if (typeof duration !== 'string') {
    duration = duration + 'ms';
  }
  for (var i = 0; i < dom.length; i++) {
    var elStyle = dom[i].style;
    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
  }
};

/**
 * transition 结束回调
 * @param dom
 * @param callback
 * @returns {mdui}
 */
mdui.transitionEnd = function (dom, callback) {
  if (!(dom instanceof jQuery)) {
    dom = $(dom);
  }
  var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
      i;

  function fireCallBack(e) {
    /*jshint validthis:true */
    if (e.target !== this) return;
    callback.call(this, e);
    for (i = 0; i < events.length; i++) {
      dom.off(events[i], fireCallBack);
    }
  }

  if (callback) {
    for (i = 0; i < events.length; i++) {
      dom.on(events[i], fireCallBack);
    }
  }
};

/**
 * animation 结束回调
 * @param dom
 * @param callback
 * @returns {mdui}
 */
mdui.animationEnd = function (dom, callback) {
  if (!(dom instanceof jQuery)) {
    dom = $(dom);
  }
  var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
      i;

  function fireCallBack(e) {
    callback(e);
    for (i = 0; i < events.length; i++) {
      dom.off(events[i], fireCallBack);
    }
  }

  if (callback) {
    for (i = 0; i < events.length; i++) {
      dom.on(events[i], fireCallBack);
    }
  }
};

(function(){
  // 存储队列。mdui.queue 和 mdui.dequeue 比 jQuery 的少一个参数
  var _queueData = [];
  /**
   * 写入队列
   * @param name 队列名
   * @param func 函数名，没有函数名时，返回所有队列
   * @returns {*}
   */
  mdui.queue = function (name, func) {
    if (typeof _queueData[name] === 'undefined') {
      _queueData[name] = [];
    }
    if (typeof func === 'undefined') {
      return _queueData[name];
    }
    _queueData[name].push(func);
  };

  /**
   * 从队列中移除一个函数，并执行该函数
   * @param name
   */
  mdui.dequeue = function (name) {
    if (_queueData[name].length) {
      (_queueData[name].shift())();
    }
  };
})();

/**
 * 参数解析
 * @param str
 * @returns {{}}
 */
var parseOptions = function (str) {
  if (!str) {
    return {};
  }

  var obj = {};
  var arr;
  var len;
  var val;
  var i;

  // 删除逗号和分号前后的空格
  str = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

  // 解析字符串
  arr = str.split(',');
  for (i = 0, len = arr.length; i < len; i++) {
    arr[i] = arr[i].split(':');
    val = arr[i][1];

    // bool 值转换
    if (typeof val === 'string' || val instanceof String) {
      val = val === 'true' || (val === 'false' ? false : val);
    }

    // 数字值转换
    if (typeof val === 'string' || val instanceof String) {
      val = !isNaN(val) ? +val : val;
    }

    obj[arr[i][0]] = val;
  }

  return obj;
};
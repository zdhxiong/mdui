/**
 * 工具
 */
(function($){
  /**
   * 参数解析
   * @param str
   * @returns {{}}
   */
  util.parseOptions = function(str) {
    if(!str){
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

  /**
   * 创建遮罩层并显示
   * @param z_index 遮罩层的 z_index
   */
  util.showMask = function(z_index) {
    var $mask = $('.md-mask');

    if(!$mask.length) {
      $mask = $('<div>').addClass('md-mask');
      $('body').append($mask);
    }

    if(z_index){
      $mask.css('z-index', z_index);
    }

    var _temp = window.getComputedStyle($mask[0]).opacity; //使动态添加的元素的 transition 动画能生效
    $mask.addClass('md-mask-show');

    return $mask;
  };

  /**
   * 隐藏遮罩层
   */
  util.hideMask = function() {
    var $mask = $('.md-mask');
    $mask.removeClass('md-mask-show');
    return $mask;
  };

  /**
   * 锁定屏幕
   */
  util.lockScreen = function(){
    $('html').addClass('md-locked');
  };

  /**
   * 解除屏幕锁定
   */
  util.unlockScreen = function(){
    $('html').removeClass('md-locked');
  };

  /**
   * transition 结束回调
   * @param dom
   * @param callback
   * @returns {util}
   */
  util.transitionEnd = function(dom, callback) {
    if(!(dom instanceof jQuery)){
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
    return this;
  };

  /**
   * animation 结束回调
   * @param dom
   * @param callback
   * @returns {util}
   */
  util.animationEnd = function(dom, callback) {
    if(!(dom instanceof jQuery)){
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
    return this;
  };

  // 公共方法
  mdui.util = {
    showMask: util.showMask,
    hideMask: util.hideMask,
    lockScreen: util.lockScreen,
    unlockScreen: util.unlockScreen,
    transitionEnd: util.transitionEnd,
    animationEnd: util.animationEnd
  };
})($);



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

      var _temp = window.getComputedStyle($mask[0]).opacity; //使动态添加的元素的 transition 动画能生效
    }

    if(z_index){
      $mask.css('z-index', z_index);
    }

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

  // 存储队列。util.queue 和 util.dequeue 比 jQuery 的少一个参数
  util._queueData = [];
  /**
   * 写入队列
   * @param name 队列名
   * @param func 函数名，没有函数名时，返回所有队列
   * @returns {*}
   */
  util.queue = function(name, func){
    if(typeof util._queueData[name] === 'undefined'){
      util._queueData[name] = [];
    }
    if(typeof func === 'undefined'){
      return util._queueData[name];
    }
    util._queueData[name].push(func);
  };

  /**
   * 从队列中移除一个函数，并执行该函数
   * @param name
   */
  util.dequeue = function(name){
    if(util._queueData[name].length){
      (util._queueData[name].shift())();
    }
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

  /**
   * 根据窗口宽度判断是否是手机设备
   * @returns {boolean}
   *
   */
  util.isPhone = function(){
    return window.innerWidth < 480;
  };

  /**
   * 根据窗口宽度判断是否是平板设备
   * @returns {boolean}
   */
  util.isTablet = function(){
    return window.innerWidth < 840 && window.innerWidth >= 480;
  };

  /**
   * 根据窗口宽度判断是否是桌面设备
   * @returns {boolean}
   */
  util.isDesktop = function(){
    return window.innerWidth >= 840;
  };

  /**
   * 判断设备是否支持 touch
   * @returns {boolean}
   */
  util.supportTouch = function(){
    return ("ontouchstart" in document);
  };

  // 公共方法
  var publicMethods = ('showMask hideMask lockScreen unlockScreen transitionEnd animationEnd').split(' ');
  mdui.util = {};
  for(var i = 0, len = publicMethods.length; i < len; i++){
    mdui.util[publicMethods[i]] = util[publicMethods[i]];
  }
})($);



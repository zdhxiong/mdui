/**
 * =============================================================================
 * ************   Headroom.js   ************
 * =============================================================================
 */

mdui.Headroom = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    tolerance: 5,                                // 滚动条滚动多少距离开始隐藏或显示元素，{down: num, up: num}，或数字
    offset: 0,                                   // 在页面顶部多少距离内滚动不会隐藏元素
    initialClass: 'mdui-headroom',               // 初始化时添加的类
    pinnedClass: 'mdui-headroom-pinned-top',     // 元素固定时添加的类
    unpinnedClass: 'mdui-headroom-unpinned-top', // 元素隐藏时添加的类
  };

  /**
   * Headroom
   * @param selector
   * @param opts
   * @constructor
   */
  function Headroom(selector, opts) {
    var _this = this;

    _this.headroom = $.dom(selector)[0];
    if (typeof _this.headroom === 'undefined') {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.headroom, 'mdui.headroom');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    // 数值转为 {down: bum, up: num}
    var tolerance = _this.options.tolerance;
    if (tolerance !== Object(tolerance)) {
      _this.options.tolerance = {
        down: tolerance,
        up: tolerance,
      };
    }

    _this._init();
  }

  /**
   * 初始化
   * @private
   */
  Headroom.prototype._init = function () {
    var _this = this;

    _this.state = 'pinned';
    _this.headroom.classList.add(_this.options.initialClass);
    _this.headroom.classList.remove(
      _this.options.pinnedClass,
      _this.options.unpinnedClass
    );

    _this.inited = false;
    _this.lastScrollY = 0;

    _this._attachEvent();
  };

  /**
   * 监听滚动事件
   * @private
   */
  Headroom.prototype._attachEvent = function () {
    var _this = this;

    if (!_this.inited) {
      _this.lastScrollY = window.pageYOffset;
      _this.inited = true;
      $.on(window, 'scroll', function () {
        _this._scroll();
      });
    }
  };

  /**
   * 滚动时的处理
   * @private
   */
  Headroom.prototype._scroll = function () {
    var _this = this;
    _this.animationFrameId = $.requestAnimationFrame(function () {
      var currentScrollY = window.pageYOffset;
      var direction = currentScrollY > _this.lastScrollY ? 'down' : 'up';
      var toleranceExceeded =
        Math.abs(currentScrollY - _this.lastScrollY) >=
        _this.options.tolerance[direction];

      if (
        currentScrollY > _this.lastScrollY &&
        currentScrollY >= _this.options.offset &&
        toleranceExceeded) {
        _this.unpin();
      } else if (
        (currentScrollY < _this.lastScrollY && toleranceExceeded) ||
        currentScrollY <= _this.options.offset
      ) {
        _this.pin();
      }

      _this.lastScrollY = currentScrollY;
    });
  };

  /**
   * 固定住
   */
  Headroom.prototype.pin = function () {
    var _this = this;

    if (
      _this.state === 'pinning' ||
      _this.state === 'pinned' ||
      !_this.headroom.classList.contains(_this.options.initialClass)
    ) {
      return;
    }

    _this.state = 'pinning';
    _this.headroom.classList.remove(_this.options.unpinnedClass);
    _this.headroom.classList.add(_this.options.pinnedClass);
    $.pluginEvent('pin', 'headroom', _this, _this.headroom);

    $.transitionEnd(_this.headroom, function () {
      if (_this.state === 'pinning') {
        _this.state = 'pinned';
        $.pluginEvent('pinned', 'headroom', _this, _this.headroom);
      }
    });
  };

  /**
   * 不固定住
   */
  Headroom.prototype.unpin = function () {
    var _this = this;

    if (
      _this.state === 'unpinning' ||
      _this.state === 'unpinned' ||
      !_this.headroom.classList.contains(_this.options.initialClass)
    ) {
      return;
    }

    _this.state = 'unpinning';
    _this.headroom.classList.remove(_this.options.pinnedClass);
    _this.headroom.classList.add(_this.options.unpinnedClass);
    $.pluginEvent('unpin', 'headroom', _this, _this.headroom);

    $.transitionEnd(_this.headroom, function () {
      if (_this.state === 'unpinning') {
        _this.state = 'unpinned';
        $.pluginEvent('unpinned', 'headroom', _this, _this.headroom);
      }
    });
  };

  /**
   * 启用
   */
  Headroom.prototype.enable = function () {
    var _this = this;

    if (!_this.inited) {
      _this._init();
    }
  };

  /**
   * 禁用
   */
  Headroom.prototype.disable = function () {
    var _this = this;

    if (_this.inited) {
      _this.inited = false;
      _this.headroom.classList.remove(
        _this.options.initialClass,
        _this.options.pinnedClass,
        _this.options.unpinnedClass
      );
      $.off(window, 'scroll', function () {
        _this._scroll();
      });

      $.cancelAnimationFrame(_this.animationFrameId);
    }
  };

  /**
   * 获取当前状态 pinning | pinned | unpinning | unpinned
   */
  Headroom.prototype.getState = function () {
    return this.state;
  };

  return Headroom;

})();

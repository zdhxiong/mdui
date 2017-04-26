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
    tolerance: 5,                                 // 滚动条滚动多少距离开始隐藏或显示元素，{down: num, up: num}，或数字
    offset: 0,                                    // 在页面顶部多少距离内滚动不会隐藏元素
    initialClass: 'mdui-headroom',                // 初始化时添加的类
    pinnedClass: 'mdui-headroom-pinned-top',      // 元素固定时添加的类
    unpinnedClass: 'mdui-headroom-unpinned-top',  // 元素隐藏时添加的类
  };

  /**
   * Headroom
   * @param selector
   * @param opts
   * @constructor
   */
  function Headroom(selector, opts) {
    var _this = this;

    _this.$headroom = $(selector).eq(0);
    if (!_this.$headroom.length) {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = _this.$headroom.data('mdui.headroom');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));

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
    _this.$headroom
      .addClass(_this.options.initialClass)
      .removeClass(_this.options.pinnedClass + ' ' + _this.options.unpinnedClass);

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

      $window.on('scroll', function () {
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
    _this.rafId = window.requestAnimationFrame(function () {
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
   * 动画结束回调
   * @param inst
   */
  var transitionEnd = function (inst) {
    if (inst.state === 'pinning') {
      inst.state = 'pinned';
      componentEvent('pinned', 'headroom', inst, inst.$headroom);
    }

    if (inst.state === 'unpinning') {
      inst.state = 'unpinned';
      componentEvent('unpinned', 'headroom', inst, inst.$headroom);
    }
  };

  /**
   * 固定住
   */
  Headroom.prototype.pin = function () {
    var _this = this;

    if (
      _this.state === 'pinning' ||
      _this.state === 'pinned' ||
      !_this.$headroom.hasClass(_this.options.initialClass)
    ) {
      return;
    }

    componentEvent('pin', 'headroom', _this, _this.$headroom);

    _this.state = 'pinning';

    _this.$headroom
      .removeClass(_this.options.unpinnedClass)
      .addClass(_this.options.pinnedClass)
      .transitionEnd(function () {
        transitionEnd(_this);
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
      !_this.$headroom.hasClass(_this.options.initialClass)
    ) {
      return;
    }

    componentEvent('unpin', 'headroom', _this, _this.$headroom);

    _this.state = 'unpinning';

    _this.$headroom
      .removeClass(_this.options.pinnedClass)
      .addClass(_this.options.unpinnedClass)
      .transitionEnd(function () {
        transitionEnd(_this);
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
      _this.$headroom
        .removeClass([
          _this.options.initialClass,
          _this.options.pinnedClass,
          _this.options.unpinnedClass,
        ].join(' '));

      $window.off('scroll', function () {
        _this._scroll();
      });

      window.cancelAnimationFrame(_this.rafId);
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

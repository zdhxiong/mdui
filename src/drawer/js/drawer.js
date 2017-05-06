/**
 * =============================================================================
 * ************   Drawer 抽屉栏   ************
 * =============================================================================
 *
 * 在桌面设备上默认显示抽屉栏，不显示遮罩层
 * 在手机和平板设备上默认不显示抽屉栏，始终显示遮罩层，且覆盖导航栏
 */

mdui.Drawer = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    // 在桌面设备上是否显示遮罩层。手机和平板不受这个参数影响，始终会显示遮罩层
    overlay: false,
  };

  var isDesktop = function () {
    return $window.width() >= 1024;
  };

  /**
   * 抽屉栏实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Drawer(selector, opts) {
    var _this = this;

    _this.$drawer = $(selector).eq(0);
    if (!_this.$drawer.length) {
      return;
    }

    var oldInst = _this.$drawer.data('mdui.drawer');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));

    _this.overlay = false; // 是否显示着遮罩层
    _this.position = _this.$drawer.hasClass('mdui-drawer-right') ? 'right' : 'left';

    if (_this.$drawer.hasClass('mdui-drawer-close')) {
      _this.state = 'closed';
    } else if (_this.$drawer.hasClass('mdui-drawer-open')) {
      _this.state = 'opened';
    } else if (isDesktop()) {
      _this.state = 'opened';
    } else {
      _this.state = 'closed';
    }

    // 浏览器窗口大小调整时
    $window.on('resize', $.throttle(function () {
      // 由手机平板切换到桌面时
      if (isDesktop()) {
        // 如果显示着遮罩，则隐藏遮罩
        if (_this.overlay && !_this.options.overlay) {
          $.hideOverlay();
          _this.overlay = false;
          $.unlockScreen();
        }

        // 没有强制关闭，则状态为打开状态
        if (!_this.$drawer.hasClass('mdui-drawer-close')) {
          _this.state = 'opened';
        }
      }

      // 由桌面切换到手机平板时。如果抽屉栏是打开着的且没有遮罩层，则关闭抽屉栏
      else {
        if (!_this.overlay && _this.state === 'opened') {
          // 抽屉栏处于强制打开状态，添加遮罩
          if (_this.$drawer.hasClass('mdui-drawer-open')) {
            $.showOverlay();
            _this.overlay = true;
            $.lockScreen();

            $('.mdui-overlay').one('click', function () {
              _this.close();
            });
          } else {
            _this.state = 'closed';
          }
        }
      }
    }, 100));

    // 绑定关闭按钮事件
    _this.$drawer.find('[mdui-drawer-close]').each(function () {
      $(this).on('click', function () {
        _this.close();
      });
    });
  }

  /**
   * 动画结束回调
   * @param inst
   */
  var transitionEnd = function (inst) {
    if (inst.$drawer.hasClass('mdui-drawer-open')) {
      inst.state = 'opened';
      componentEvent('opened', 'drawer', inst, inst.$drawer);
    } else {
      inst.state = 'closed';
      componentEvent('closed', 'drawer', inst, inst.$drawer);
    }
  };

  /**
   * 打开抽屉栏
   */
  Drawer.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    _this.state = 'opening';
    componentEvent('open', 'drawer', _this, _this.$drawer);

    if (!_this.options.overlay) {
      $('body').addClass('mdui-drawer-body-' + _this.position);
    }

    _this.$drawer
      .removeClass('mdui-drawer-close')
      .addClass('mdui-drawer-open')
      .transitionEnd(function () {
        transitionEnd(_this);
      });

    if (!isDesktop() || _this.options.overlay) {
      _this.overlay = true;
      $.showOverlay().one('click', function () {
        _this.close();
      });

      $.lockScreen();
    }
  };

  /**
   * 关闭抽屉栏
   */
  Drawer.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    _this.state = 'closing';
    componentEvent('close', 'drawer', _this, _this.$drawer);

    if (!_this.options.overlay) {
      $('body').removeClass('mdui-drawer-body-' + _this.position);
    }

    _this.$drawer
      .addClass('mdui-drawer-close')
      .removeClass('mdui-drawer-open')
      .transitionEnd(function () {
        transitionEnd(_this);
      });

    if (_this.overlay) {
      $.hideOverlay();
      _this.overlay = false;
      $.unlockScreen();
    }
  };

  /**
   * 切换抽屉栏打开/关闭状态
   */
  Drawer.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 获取抽屉栏状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Drawer.prototype.getState = function () {
    return this.state;
  };

  return Drawer;

})();

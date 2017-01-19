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

  /**
   * 抽屉栏实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Drawer(selector, opts) {
    var _this = this;

    _this.drawer = $.dom(selector)[0];
    if (typeof _this.drawer === 'undefined') {
      return;
    }

    var oldInst = $.data(_this.drawer, 'mdui.drawer');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    _this.overlay = false; // 是否显示着遮罩层
    _this.position = _this.drawer.classList.contains('mdui-drawer-right') ? 'right' : 'left';

    if (_this.drawer.classList.contains('mdui-drawer-close')) {
      _this.state = 'closed';
    } else if (_this.drawer.classList.contains('mdui-drawer-open')) {
      _this.state = 'opened';
    } else if (mdui.screen.mdUp()) {
      _this.state = 'opened';
    } else {
      _this.state = 'closed';
    }

    // 浏览器窗口大小调整时
    $.on(window, 'resize', mdui.throttle(function () {
      // 由手机平板切换到桌面时
      if (mdui.screen.mdUp()) {
        // 如果显示着遮罩，则隐藏遮罩
        if (_this.overlay && !_this.options.overlay) {
          mdui.hideOverlay();
          _this.overlay = false;

          mdui.unlockScreen();
        }

        // 没有强制关闭，则状态为打开状态
        if (!_this.drawer.classList.contains('mdui-drawer-close')) {
          _this.state = 'opened';
        }
      }

      // 由桌面切换到手机平板时。如果抽屉栏是打开着的且没有遮罩层，则关闭抽屉栏
      else {
        if (!_this.overlay && _this.state === 'opened') {
          // 抽屉栏处于强制打开状态，添加遮罩
          if (_this.drawer.classList.contains('mdui-drawer-open')) {
            mdui.showOverlay();
            _this.overlay = true;

            mdui.lockScreen();

            $.one($.query('.mdui-overlay'), 'click', function () {
              _this.close();
            });
          } else {
            _this.state = 'closed';
          }
        }
      }

    }, 100));

    // 不支持 touch 的设备默认隐藏滚动条，鼠标移入时显示滚动条；支持 touch 的设备会自动隐藏滚动条
    if (!mdui.support.touch) {
      _this.drawer.style['overflow-y'] = 'hidden';
      _this.drawer.classList.add('mdui-drawer-scrollbar');
    }

    // 绑定关闭按钮事件
    var closes = $.queryAll('[mdui-drawer-close]', _this.drawer);
    $.each(closes, function (i, close) {
      $.on(close, 'click', function () {
        _this.close();
      });
    });
  }

  /**
   * 打开抽屉栏
   */
  Drawer.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    _this.drawer.classList.remove('mdui-drawer-close');
    _this.drawer.classList.add('mdui-drawer-open');

    _this.state = 'opening';
    $.pluginEvent('open', 'drawer', _this, _this.drawer);

    if (!_this.options.overlay) {
      document.body.classList.add('mdui-drawer-body-' + _this.position);
    }

    $.transitionEnd(_this.drawer, function () {
      if (_this.drawer.classList.contains('mdui-drawer-open')) {
        _this.state = 'opened';
        $.pluginEvent('opened', 'drawer', _this, _this.drawer);
      }
    });

    if (!mdui.screen.mdUp() || _this.options.overlay) {
      var overlay = mdui.showOverlay();
      _this.overlay = true;

      mdui.lockScreen();

      $.one(overlay, 'click', function () {
        _this.close();
      });
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

    _this.drawer.classList.add('mdui-drawer-close');
    _this.drawer.classList.remove('mdui-drawer-open');
    _this.state = 'closing';
    $.pluginEvent('close', 'drawer', _this, _this.drawer);

    if (!_this.options.overlay) {
      document.body.classList.remove('mdui-drawer-body-' + _this.position);
    }

    $.transitionEnd(_this.drawer, function () {
      if (!_this.drawer.classList.contains('mdui-drawer-open')) {
        _this.state = 'closed';
        $.pluginEvent('closed', 'drawer', _this, _this.drawer);
      }
    });

    if (_this.overlay) {
      mdui.hideOverlay();
      _this.overlay = false;

      mdui.unlockScreen();
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

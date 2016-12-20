/**
 * =============================================================================
 * ************   Fab 浮动操作按钮   ************
 * =============================================================================
 */

mdui.Fab = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    trigger: 'hover',      // 触发方式 ['hover', 'click']
  };

  /**
   * 浮动操作按钮实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Fab(selector, opts) {
    var _this = this;

    _this.fab = $.dom(selector)[0];
    if (typeof _this.fab === 'undefined') {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.data(_this.fab, 'mdui.fab');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    _this.btn = $.child(_this.fab, '.mdui-fab');
    _this.dial = $.child(_this.fab, '.mdui-fab-dial');
    _this.dialBtns = $.queryAll('.mdui-fab', _this.dial);

    // 支持 touch 时，始终在 touchstart 时切换，不受 trigger 参数影响
    if (mdui.support.touch) {
      $.on(_this.btn, 'touchstart', function () {
        _this.open();
      });

      $.on(document, 'touchend', function (e) {
        if (!$.parents(e.target, '.mdui-fab-wrapper').length) {
          _this.close();
        }
      });
    }

    // 不支持touch
    else {

      // 点击切换
      if (_this.options.trigger === 'click') {
        $.on(_this.btn, 'click', function () {
          _this.toggle();
        });
      }

      // 鼠标悬浮切换
      if (_this.options.trigger === 'hover') {
        $.on(_this.fab, 'mouseenter', function () {
          _this.open();
        });

        $.on(_this.fab, 'mouseleave', function () {
          _this.close();
        });
      }
    }
  }

  /**
   * 打开菜单
   */
  Fab.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    // 为菜单中的按钮添加不同的 transition-delay
    $.each(_this.dialBtns, function (index, btn) {
      btn.style['transition-delay'] = 15 * (_this.dialBtns.length - index) + 'ms';
    });

    _this.dial.classList.add('mdui-fab-dial-show');

    // 如果按钮中存在 .mdui-fab-opened 的图标，则进行图标切换
    if ($.query('.mdui-fab-opened', _this.btn)) {
      _this.btn.classList.add('mdui-fab-opened');
    }

    _this.state = 'opening';
    $.pluginEvent('open', 'fab', _this, _this.fab);

    // 打开顺序为从下到上逐个打开，最上面的打开后才表示动画完成
    $.transitionEnd(_this.dialBtns[0], function () {
      if (_this.btn.classList.contains('mdui-fab-opened')) {
        _this.state = 'opened';
        $.pluginEvent('opened', 'fab', _this, _this.fab);
      }
    });
  };

  /**
   * 关闭菜单
   */
  Fab.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    // 为菜单中的按钮添加不同的 transition-delay
    $.each(_this.dialBtns, function (index, btn) {
      btn.style['transition-delay'] = 15 * index + 'ms';
    });

    _this.dial.classList.remove('mdui-fab-dial-show');
    _this.btn.classList.remove('mdui-fab-opened');
    _this.state = 'closing';
    $.pluginEvent('close', 'fab', _this, _this.fab);

    // 从上往下依次关闭，最后一个关闭后才表示动画完成
    $.transitionEnd(_this.dialBtns[_this.dialBtns.length - 1], function () {
      if (!_this.btn.classList.contains('mdui-fab-opened')) {
        _this.state = 'closed';
        $.pluginEvent('closed', 'fab', _this, _this.fab);
      }
    });
  };

  /**
   * 切换菜单的打开状态
   */
  Fab.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 获取当前菜单状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Fab.prototype.getState = function () {
    return this.state;
  };

  /**
   * 以动画的形式显示浮动操作按钮
   */
  Fab.prototype.show = function () {
    this.fab.classList.remove('mdui-fab-hide');
  };

  /**
   * 以动画的形式隐藏浮动操作按钮
   */
  Fab.prototype.hide = function () {
    this.fab.classList.add('mdui-fab-hide');
  };

  return Fab;
})();

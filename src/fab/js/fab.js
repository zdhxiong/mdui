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
   * @param selector 选择器或 HTML 字符串或 DOM 元素或 JQ 对象
   * @param opts
   * @constructor
   */
  function Fab(selector, opts) {
    var _this = this;

    _this.$fab = $(selector).eq(0);
    if (!_this.$fab.length) {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = _this.$fab.data('mdui.fab');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));
    _this.state = 'closed';

    _this.$btn = _this.$fab.find('.mdui-fab');
    _this.$dial = _this.$fab.find('.mdui-fab-dial');
    _this.$dialBtns = _this.$dial.find('.mdui-fab');

    if (_this.options.trigger === 'hover') {
      _this.$btn
        .on('touchstart mouseenter', function () {
          _this.open();
        });

      _this.$fab
        .on('mouseleave', function () {
          _this.close();
        });
    }

    if (_this.options.trigger === 'click') {
      _this.$btn
        .on(TouchHandler.start, function () {
          _this.open();
        });
    }

    // 触摸屏幕其他地方关闭快速拨号
    $document.on(TouchHandler.start, function (e) {
      if (!$(e.target).parents('.mdui-fab-wrapper').length) {
        _this.close();
      }
    });
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
    _this.$dialBtns.each(function (index, btn) {
      btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] =
        15 * (_this.$dialBtns.length - index) + 'ms';
    });

    _this.$dial.addClass('mdui-fab-dial-show');

    // 如果按钮中存在 .mdui-fab-opened 的图标，则进行图标切换
    if (_this.$btn.find('.mdui-fab-opened').length) {
      _this.$btn.addClass('mdui-fab-opened');
    }

    _this.state = 'opening';
    componentEvent('open', 'fab', _this, _this.$fab);

    // 打开顺序为从下到上逐个打开，最上面的打开后才表示动画完成
    _this.$dialBtns.eq(0).transitionEnd(function () {
      if (_this.$btn.hasClass('mdui-fab-opened')) {
        _this.state = 'opened';
        componentEvent('opened', 'fab', _this, _this.$fab);
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
    _this.$dialBtns.each(function (index, btn) {
      btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] = 15 * index + 'ms';
    });

    _this.$dial.removeClass('mdui-fab-dial-show');
    _this.$btn.removeClass('mdui-fab-opened');
    _this.state = 'closing';
    componentEvent('close', 'fab', _this, _this.$fab);

    // 从上往下依次关闭，最后一个关闭后才表示动画完成
    _this.$dialBtns.eq(-1).transitionEnd(function () {
      if (!_this.$btn.hasClass('mdui-fab-opened')) {
        _this.state = 'closed';
        componentEvent('closed', 'fab', _this, _this.$fab);
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
    this.$fab.removeClass('mdui-fab-hide');
  };

  /**
   * 以动画的形式隐藏浮动操作按钮
   */
  Fab.prototype.hide = function () {
    this.$fab.addClass('mdui-fab-hide');
  };

  return Fab;
})();

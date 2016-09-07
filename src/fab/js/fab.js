/**
 * 浮动操作按钮
 */
mdui.Fab = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    // 触发方式 ['hover', 'click']
    trigger: 'hover',
    onOpening: function (inst) {
    },
    onOpened: function (inst) {
    },
    onClosing: function (inst) {
    },
    onClosed: function (inst) {
    }
  };

  /**
   * 浮动操作按钮实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Fab(selector, opts) {
    var inst = this;

    inst.target = $.dom(selector)[0];
    inst.options = $.extend(DEFAULT, (opts || {}));

    inst.btn = $.children(inst.target, '.md-btn', true);
    inst.dial = $.children(inst.target, '.md-btn-fab-dial', true);
    inst.dialBtns = $.toArray(inst.dial.querySelectorAll('.md-btn'));

    inst.state = 'closed';

    // 支持 touch 时，始终在 touchstart 时切换，不受 trigger 参数影响
    if (mdui.support.touch) {
      $.on(inst.btn, 'touchstart', function () {
        inst.open();
      });

      $.on(document, 'touchend', function (e) {
        if (!$.parents(e.target, '.md-btn-fab-wrapper').length) {
          inst.close();
        }
      });
    }

    // 不支持touch
    else {

      //点击切换
      if (inst.options.trigger === 'click') {
        $.on(inst.btn, 'click', function () {
          inst.toggle();
        });
      }

      // 鼠标悬浮血环
      if (inst.options.trigger === 'hover') {
        $.on(inst.target, 'mouseenter', function () {
          inst.open();
        });

        $.on(inst.target, 'mouseleave', function () {
          inst.close();
        });
      }
    }
  }

  /**
   * 打开菜单
   */
  Fab.prototype.open = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      return;
    }

    // 为菜单中的按钮添加不同的 transition-delay
    $.each(inst.dialBtns, function (index, btn) {
      btn.style['transition-delay'] = 15 * (inst.dialBtns.length - index) + 'ms';
    });

    inst.dial.classList.add('md-btn-fab-dial-show');
    inst.state = 'opening';
    $.pluginEvent('opening', 'fab', inst);

    // 打开顺序为从下到上逐个打开，最上面的打开后才表示动画完成
    $.transitionEnd(inst.dialBtns[0], function () {
      inst.state = 'opened';
      $.pluginEvent('opened', 'fab', inst);
    });
  };

  /**
   * 关闭菜单
   */
  Fab.prototype.close = function () {
    var inst = this;

    if (inst.state === 'closing' || inst.state === 'closed') {
      return;
    }

    // 为菜单中的按钮添加不同的 transition-delay
    $.each(inst.dialBtns, function (index, btn) {
      btn.style['transition-delay'] = 15 * index + 'ms';
    });

    inst.dial.classList.remove('md-btn-fab-dial-show');
    inst.state = 'closing';
    $.pluginEvent('closing', 'fab', inst);

    //从上往下依次关闭，最后一个关闭后才表示动画完成
    $.transitionEnd(inst.dialBtns[inst.dialBtns.length - 1], function () {
      inst.state = 'closed';
      $.pluginEvent('closed', 'fab', inst);
    });
  };

  /**
   * 切换菜单的打开状态
   */
  Fab.prototype.toggle = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      inst.close();
    } else if (inst.state === 'closing' || inst.state === 'closed') {
      inst.open();
    }
  };

  /**
   * 获取当前菜单状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Fab.prototype.getState = function () {
    return this.state;
  };

  return Fab;
})();


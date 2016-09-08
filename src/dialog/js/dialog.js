/**
 * 对话框
 */

mdui.Dialog = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    // 点击对话框外面区域关闭对话框
    closeBlur: true,
    // 按下 esc 关闭对话框
    closeEsc: true,
    // 是否显示遮罩层
    mask: true,
    // 跟踪 hashchange
    hashTracking: true,
    // 关闭后销毁
    destroyAfterClose: false,
    /**
     * 点击按钮的回调
     * @param inst 对话框实例
     * @param i 第 i 个按钮
     */
    onClick: function (inst, i) {
    },

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
   * 当前对话框
   */
  var current;

  /**
   * 队列名
   * @type {string}
   */
  var queueName = '__md_dialog';

  /**
   * 对话框实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Dialog(selector, opts) {
    var inst = this;

    inst.target = $.dom(selector)[0];

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.getData(inst.target, 'dialog.mdui');
    if(oldInst){
      return oldInst;
    }

    inst.options = $.extend(DEFAULT, (opts || {}));
    inst.state = 'closed';
    inst.content = inst.target.querySelector('.md-dialog-content');

    inst.buttons = inst.target.querySelectorAll('.md-dialog-buttons .md-btn');

    // 绑定按钮点击事件
    $.each(inst.buttons, function (i, button) {
      $.on(button, 'click', function () {
        inst.options.onClick(inst, i);
      });
    });

    // 点击对话框外面关闭对话框
    $.on(inst.target, 'click', function (e) {
      if (!inst.options.closeBlur) {
        return;
      }

      var target = e.target;
      if (!target.classList.contains('md-dialog')) {
        return;
      }

      inst.close();
    });
  }

  /**
   * 打开对话框
   */
  Dialog.prototype.open = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      return;
    }

    // 如果当前有正在打开或已经打开的对话框，则先加入队列，等旧对话框开始关闭时再打开
    if (current && (current.state === 'opening' || current.state === 'opened')) {
      $.queue(queueName, function () {
        inst.open();
      });
      return;
    }

    current = inst;

    inst.target.classList.add('md-dialog-open');
    var _temp = window.getComputedStyle(inst.content).opacity; //使动态添加的元素的 transition 动画能生效
    inst.content.classList.add('md-dialog-open');

    mdui.lockScreen();

    inst.state = 'opening';
    $.pluginEvent('opening', 'dialog', inst);

    $.transitionEnd(inst.content, function () {
      inst.state = 'opened';
      $.pluginEvent('opened', 'dialog', inst);
    });

    if (inst.options.mask) {
      mdui.showMask(300);
    }

    if (inst.options.hashTracking) {
      // 如果 hash 中原来就有 &md-dialod，先删除，避免后退历史纪录后仍然有 &md-dialog 导致无法关闭
      var hash = location.hash.substring(1);
      if (hash.indexOf('&md-dialog') > -1) {
        hash = hash.replace(/&md-dialog/g, '');
      }

      // 后退按钮关闭对话框
      location.hash = hash + '&md-dialog';
      $.on(window, 'hashchange', function () {
        if (location.hash.substring(1).indexOf('&md-dialog') < 0) {
          inst.close(true);
        }
      });
    }
  };

  /**
   * 关闭对话框
   */
  Dialog.prototype.close = function () {
    var inst = this;

    if (inst.state === 'closing' || inst.state === 'closed') {
      return;
    }

    inst.content.classList.remove('md-dialog-open');
    inst.state = 'closing';
    $.pluginEvent('closing', 'dialog', inst);

    $.transitionEnd(inst.content, function () {
      inst.target.classList.remove('md-dialog-open');
      inst.state = 'closed';
      $.pluginEvent('closed', 'dialog', inst);

      if ($.queue(queueName).length === 0 && current.state === 'closed') {
        mdui.unlockScreen();
      }

      if (inst.options.destroyAfterClose) {
        inst.destroy();
      }
    });

    if (inst.options.mask && $.queue(queueName).length === 0) {
      mdui.hideMask();
    }

    if (inst.options.hashTracking && $.queue(queueName).length === 0) {
      // 是否需要后退历史纪录，默认为 false。
      // 为 false 时是通过 js 关闭，需要后退一个历史记录
      // 为 true 时是通过后退按钮关闭，不需要后退历史记录
      if (!arguments[0]) {
        window.history.back();
      }
      $.off(window, 'hashchange');
    }

    // 关闭旧对话框，打开新对话框。
    // 加一点延迟，仅仅为了视觉效果更好。不加延时也不影响功能
    setTimeout(function () {
      $.dequeue(queueName);
    }, 100);

  };

  /**
   * 切换对话框的打开/关闭状态
   */
  Dialog.prototype.toggle = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      inst.close();
    }
    if (inst.state === 'closing' || inst.state === 'closed') {
      inst.open();
    }
  };

  /**
   * 获取对话框状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Dialog.prototype.getState = function () {
    return this.state;
  };

  /**
   * 销毁对话框
   */
  Dialog.prototype.destroy = function () {
    var inst = this;

    inst.target.parentNode.removeChild(inst.target);

    if (current === inst) {
      mdui.unlockScreen();
      mdui.hideMask();
    }
  };

  // esc 按下时关闭对话框
  $.on(document, 'keydown', function (e) {
    if (current && current.options.closeEsc && current.state === 'opened' && e.keyCode === 27) {
      current.close();
    }
  });

  return Dialog;
})();

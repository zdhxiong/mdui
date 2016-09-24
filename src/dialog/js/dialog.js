/**
 提示框
 */

mdui.Dialog = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    history: true,                // 监听 hashchange 事件
    overlay: true,                // 打开提示框时显示遮罩
    closeOnClick: true,           // 点击提示框外面区域关闭提示框
    closeOnEsc: true,             // 按下 esc 关闭提示框
    closeOnCancel: true,          // 按下取消按钮时关闭提示框
    closeOnConfirm: true,         // 按下确认按钮时关闭提示框
    destroyOnClosed: false        // 关闭后销毁
  };

  /**
   * 遮罩层元素
   */
  var overlay;

  /**
   * 当前提示框
   */
  var current;

  /**
   * 队列名
   * @type {string}
   */
  var queueName = '__md_dialog';

  /**
   * 窗口宽度变化，或提示框内容变化时，调整提示框位置和提示框内的滚动条
   */
  function readjust() {
    if(!current) {
      return;
    }
    var dialog = current.dialog;

    var dialogTitle = $.children(dialog, '.md-dialog-title', true);
    var dialogContent = $.children(dialog, '.md-dialog-content', true);
    var dialogActions = $.children(dialog, '.md-dialog-actions', true);

    // 调整 dialog 的 top 和 height 值
    dialog.style.height = '';
    if(dialogContent){
      dialogContent.style.height = '';
    }
    var dialogHeight = dialog.clientHeight;
    dialog.style.top = ((window.innerHeight - dialogHeight) / 2) + 'px';
    dialog.style.height = dialogHeight + 'px';

    // 调整 md-dialog-content 的高度
    var dialogTitleHeight = dialogTitle ? dialogTitle.scrollHeight : 0;
    var dialogActionsHeight = dialogActions ? dialogActions.scrollHeight : 0;
    if (dialogContent) {
      dialogContent.style.height = dialogHeight - dialogTitleHeight - dialogActionsHeight + 'px';
    }
  }

  /**
   * hashchange 事件
   */
  function hashchangeEvent() {
    if (location.hash.substring(1).indexOf('&md-dialog') < 0) {
      current.close(true);
    }
  }

  /**
   * 提示框实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Dialog(selector, opts) {
    var inst = this;

    // 提示框元素
    inst.dialog = $.dom(selector)[0];

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.getData(inst.dialog, 'inst.mdui.dialog');
    if (oldInst) {
      return oldInst;
    }

    inst.options = $.extend(DEFAULT, (opts || {}));
    inst.state = 'closed';

    // 在不支持触摸的设备上美化滚动条
    if (!mdui.support.touch) {
      var content = $.query('.md-dialog-content', inst.dialog);
      if (content) {
        content.classList.add('md-dialog-scrollbar');
      }
    }

    // 绑定事件
    var cancel = $.query('[data-md-dialog-cancel]', inst.dialog);
    var confirm = $.query('[data-md-dialog-confirm]', inst.dialog);
    var close = $.query('[data-md-dialog-close]', inst.dialog);
    if(cancel){
      $.on(cancel, 'click', function(){
        $.pluginEvent('cancel', 'dialog', inst, inst.dialog);
        if(inst.options.closeOnCancel){
          inst.close();
        }
      });
    }
    if(confirm){
      $.on(confirm, 'click', function(){
        $.pluginEvent('confirm', 'dialog', inst, inst.dialog);
        if(inst.options.closeOnConfirm){
          inst.close();
        }
      });
    }
    if(close){
      $.on(close, 'click', function(){
        inst.close();
      });
    }
  }

  /**
   * 打开提示框
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

    mdui.lockScreen();

    inst.dialog.style.display = 'block';

    readjust();
    $.on(window, 'resize', readjust);

    // 打开消息框
    inst.dialog.classList.add('md-dialog-open');

    inst.state = 'opening';
    $.pluginEvent('open', 'dialog', inst, inst.dialog);

    $.transitionEnd(inst.dialog, function () {
      inst.state = 'opened';
      $.pluginEvent('opened', 'dialog', inst, inst.dialog);
    });

    if (!overlay) {
      overlay = mdui.showOverlay(300);

      if(!inst.options.overlay) {
        overlay.style.background = 'transparent';
      }

      // 点击遮罩层关闭提示框
      if (inst.options.closeOnClick) {
        $.one(overlay, 'click', function (e) {
          if (e.target.classList.contains('md-overlay')) {
            inst.close();
          }
        });
      }
    }

    if (inst.options.history) {
      // 如果 hash 中原来就有 &md-dialod，先删除，避免后退历史纪录后仍然有 &md-dialog 导致无法关闭
      var hash = location.hash.substring(1);
      if (hash.indexOf('&md-dialog') > -1) {
        hash = hash.replace(/&md-dialog/g, '');
      }

      // 后退按钮关闭对话框
      location.hash = hash + '&md-dialog';
      $.on(window, 'hashchange', hashchangeEvent);
    }
  };

  /**
   * 关闭提示框
   */
  Dialog.prototype.close = function () {
    var inst = this;

    if (inst.state === 'closing' || inst.state === 'closed') {
      return;
    }

    inst.dialog.classList.remove('md-dialog-open');
    inst.state = 'closing';
    $.pluginEvent('close', 'dialog', inst, inst.dialog);

    if ($.queue(queueName).length === 0) {
      mdui.hideOverlay(overlay);
      overlay = null;
    }

    $.transitionEnd(inst.dialog, function () {
      inst.state = 'closed';
      $.pluginEvent('closed', 'dialog', inst, inst.dialog);

      inst.dialog.style.display = 'none';

      // 所有提示框都关闭后
      if ($.queue(queueName).length === 0) {
        mdui.unlockScreen();
      }

      $.off(window, 'resize', readjust);

      if (inst.options.destroyOnClosed) {
        inst.destroy();
      }
    });

    if (inst.options.history && $.queue(queueName).length === 0) {
      // 是否需要后退历史纪录，默认为 false。
      // 为 false 时是通过 js 关闭，需要后退一个历史记录
      // 为 true 时是通过后退按钮关闭，不需要后退历史记录
      if (!arguments[0]) {
        window.history.back();
      }
      $.off(window, 'hashchange', hashchangeEvent);
    }

    // 关闭旧对话框，打开新对话框。
    // 加一点延迟，仅仅为了视觉效果更好。不加延时也不影响功能
    setTimeout(function () {
      $.dequeue(queueName);
    }, 100);
  };

  /**
   * 切换提示框打开/关闭状态
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
   * 获取提示框状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Dialog.prototype.getState = function () {
    return this.state;
  };

  /**
   * 销毁提示框
   */
  Dialog.prototype.destroy = function () {
    var inst = this;

    inst.dialog.parentNode.removeChild(inst.dialog);
    $.removeData(inst.dialog, 'dialog.mdui');

    if (current === inst) {
      mdui.unlockScreen();
      mdui.hideOverlay();
    }
  };

  /**
   * 提示框内容变化时，需要调用该方法来调整提示框位置和滚动条高度
   */
  Dialog.prototype.handleUpdate = function () {
    readjust();
  };

  // esc 按下时关闭对话框
  $.on(document, 'keydown', function (e) {
    if (current && current.options.closeOnEsc && current.state === 'opened' && e.keyCode === 27) {
      current.close();
    }
  });

  return Dialog;

})();
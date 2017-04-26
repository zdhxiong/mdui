/**
 * =============================================================================
 * ************   mdui.dialog(options)   ************
 * =============================================================================
 */

mdui.dialog = function (options) {

  /**
   * 默认参数
   */
  var DEFAULT = {
    title: '',                // 标题
    content: '',              // 文本
    buttons: [],              // 按钮
    stackedButtons: false,    // 垂直排列按钮
    cssClass: '',             // 在 Dialog 上添加的 CSS 类
    history: true,            // 监听 hashchange 事件
    overlay: true,            // 是否显示遮罩
    modal: false,             // 是否模态化对话框
    closeOnEsc: true,         // 按下 esc 时关闭对话框
    destroyOnClosed: true,    // 关闭后销毁
    onOpen: function () {     // 打开动画开始时的回调
    },

    onOpened: function () {   // 打开动画结束后的回调
    },

    onClose: function () {    // 关闭动画开始时的回调
    },

    onClosed: function () {   // 关闭动画结束时的回调
    },
  };

  /**
   * 按钮的默认参数
   */
  var DEFAULT_BUTTON = {
    text: '',                   // 按钮文本
    bold: false,                // 按钮文本是否加粗
    close: true,                // 点击按钮后关闭对话框
    onClick: function (inst) {  // 点击按钮的回调
    },
  };

  // 合并参数
  options = $.extend({}, DEFAULT, (options || {}));
  $.each(options.buttons, function (i, button) {
    options.buttons[i] = $.extend({}, DEFAULT_BUTTON, button);
  });

  // 按钮的 HTML
  var buttonsHTML = '';
  if (options.buttons.length) {
    buttonsHTML =
      '<div class="mdui-dialog-actions ' +
        (options.stackedButtons ? 'mdui-dialog-actions-stacked' : '') +
      '">';
    $.each(options.buttons, function (i, button) {
      buttonsHTML +=
        '<a href="javascript:void(0)" ' +
          'class="mdui-btn mdui-ripple mdui-text-color-primary ' +
          (button.bold ? 'mdui-btn-bold' : '') + '">' +
          button.text +
        '</a>';
    });

    buttonsHTML += '</div>';
  }

  // Dialog 的 HTML
  var HTML =
    '<div class="mdui-dialog ' + options.cssClass + '">' +
      (options.title ? '<div class="mdui-dialog-title">' + options.title + '</div>' : '') +
      (options.content ? '<div class="mdui-dialog-content">' + options.content + '</div>' : '') +
      buttonsHTML +
    '</div>';

  // 实例化 Dialog
  var inst = new mdui.Dialog(HTML, {
    history: options.history,
    overlay: options.overlay,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
    destroyOnClosed: options.destroyOnClosed,
  });

  // 绑定按钮事件
  if (options.buttons.length) {
    inst.$dialog.find('.mdui-dialog-actions .mdui-btn').each(function (i, button) {
      $(button).on('click', function () {
        if (typeof options.buttons[i].onClick === 'function') {
          options.buttons[i].onClick(inst);
        }

        if (options.buttons[i].close) {
          inst.close();
        }
      });
    });
  }

  // 绑定打开关闭事件
  if (typeof options.onOpen === 'function') {
    inst.$dialog
      .on('open.mdui.dialog', function () {
        options.onOpen(inst);
      })
      .on('opened.mdui.dialog', function () {
        options.onOpened(inst);
      })
      .on('close.mdui.dialog', function () {
        options.onClose(inst);
      })
      .on('closed.mdui.dialog', function () {
        options.onClosed(inst);
      });
  }

  inst.open();

  return inst;
};

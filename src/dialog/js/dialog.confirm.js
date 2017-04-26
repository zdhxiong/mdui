/**
 * =============================================================================
 * ************   mdui.confirm(text, title, onConfirm, onCancel, options)   ************
 * ************   mdui.confirm(text, onConfirm, onCancel, options)          ************
 * =============================================================================
 */

mdui.confirm = function (text, title, onConfirm, onCancel, options) {

  // title 参数可选
  if (typeof title === 'function') {
    title = '';
    onConfirm = arguments[1];
    onCancel = arguments[2];
    options = arguments[3];
  }

  if (onConfirm === undefined) {
    onConfirm = function () {};
  }

  if (onCancel === undefined) {
    onCancel = function () {};
  }

  if (options === undefined) {
    options = {};
  }

  /**
   * 默认参数
   */
  var DEFAULT = {
    confirmText: 'ok',            // 确认按钮的文本
    cancelText: 'cancel',         // 取消按钮的文本
    history: true,                // 监听 hashchange 事件
    modal: false,                 // 是否模态化对话框，为 false 时点击对话框外面区域关闭对话框，为 true 时不关闭
    closeOnEsc: true,             // 按下 esc 关闭对话框
  };

  options = $.extend({}, DEFAULT, options);

  return mdui.dialog({
    title: title,
    content: text,
    buttons: [
      {
        text: options.cancelText,
        bold: false,
        close: true,
        onClick: onCancel,
      },
      {
        text: options.confirmText,
        bold: false,
        close: true,
        onClick: onConfirm,
      },
    ],
    cssClass: 'mdui-dialog-confirm',
    history: options.history,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
  });
};

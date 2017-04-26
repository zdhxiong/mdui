/**
 * =============================================================================
 * ************   mdui.prompt(label, title, onConfirm, onCancel, options)   ************
 * ************   mdui.prompt(label, onConfirm, onCancel, options)          ************
 * =============================================================================
 */

mdui.prompt = function (label, title, onConfirm, onCancel, options) {

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
    confirmText: 'ok',        // 确认按钮的文本
    cancelText: 'cancel',     // 取消按钮的文本
    history: true,            // 监听 hashchange 事件
    modal: false,             // 是否模态化对话框，为 false 时点击对话框外面区域关闭对话框，为 true 时不关闭
    closeOnEsc: true,         // 按下 esc 关闭对话框
    type: 'text',             // 输入框类型，text: 单行文本框 textarea: 多行文本框
    maxlength: '',            // 最大输入字符数
    defaultValue: '',         // 输入框中的默认文本
  };

  options = $.extend({}, DEFAULT, options);

  var content =
    '<div class="mdui-textfield">' +
      (label ? '<label class="mdui-textfield-label">' + label + '</label>' : '') +
      (options.type === 'text' ?
        '<input class="mdui-textfield-input" type="text" ' +
          'value="' + options.defaultValue + '" ' +
          (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '/>' :
        '') +
      (options.type === 'textarea' ?
        '<textarea class="mdui-textfield-input" ' +
          (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '>' +
            options.defaultValue +
        '</textarea>' :
        '') +
    '</div>';

  return mdui.dialog({
    title: title,
    content: content,
    buttons: [
      {
        text: options.cancelText,
        bold: false,
        close: true,
        onClick: function (inst) {
          var value = inst.$dialog.find('.mdui-textfield-input').val();
          onCancel(value, inst);
        },
      },
      {
        text: options.confirmText,
        bold: false,
        close: true,
        onClick: function (inst) {
          var value = inst.$dialog.find('.mdui-textfield-input').val();
          onConfirm(value, inst);
        },
      },
    ],
    cssClass: 'mdui-dialog-prompt',
    history: options.history,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
    onOpen: function (inst) {

      // 初始化输入框
      var $input = inst.$dialog.find('.mdui-textfield-input');
      mdui.updateTextFields($input);

      // 聚焦到输入框
      $input[0].focus();

      // 如果是多行输入框，监听输入框的 input 事件，更新对话框高度
      if (options.type === 'textarea') {
        $input.on('input', function () {
          inst.handleUpdate();
        });
      }

      // 有字符数限制时，加载完文本框后 DOM 会变化，需要更新对话框高度
      if (options.maxlength) {
        inst.handleUpdate();
      }
    },
  });

};

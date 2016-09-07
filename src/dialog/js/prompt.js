/**
 * 弹出输入框
 */
mdui.prompt = function(text, title, onConfirm, onCancel, option){
  if(typeof title === 'function'){
    title = '';
    onConfirm = arguments[1];
    onCancel = arguments[2];
    option = arguments[3];
  }

  var DEFAULT = {
    defaultVal: '',               // 默认值
    placeholder: '',              // placeholder的值
    type: 'text',                 // 输入框类型：textarea 或 input 中的 type 的值
    cssClass: '',                 // 附加的 css 类
    buttonConfirmText: 'ok',      // 确认按钮上的文本
    buttonCancelText: 'cancel',   // 取消按钮上的文本
    buttonConfirmCssClass: '',    // 确认按钮上添加的 css 类
    buttonCancelCssClass: '',     // 取消按钮上添加的 css 类
    closeBlur: false,             // 点击对话框外面的区域关闭对话框
    closeEsc: true,               // 按下 esc 键关闭对话框
    mask: true,                   // 打开对话框时显示遮罩层
    hashTracking: true,           // hash 跟踪
    destroyAfterClose: true       // 关闭对话框后自动销毁
  };
  var options = $.extend({}, DEFAULT, option);

  if(!options.type){
    options.type = 'text';
  }
  var content;
  if(options.type === 'textarea'){
    content = '<textarea></textarea>';
  }else{
    content = '<input type="' + options.type + '"/>';
  }

  return mdui.dialog({
    title: title,
    text: text,
    content: content,
    buttons: [
      {
        text: options.buttonCancelText,
        cssClass: options.buttonCancelCssClass,
        close: true,
        onClick: onCancel
      },
      {
        text: options.buttonConfirmText,
        cssClass: options.buttonConfirmCssClass,
        close: true,
        onClick: onConfirm
      }
    ],
    stackedButtons: false,
    cssClass: 'md-dialog-prompt ' + options.cssClass,
    closeBlur: options.closeBlur,
    closeEsc: options.closeEsc,
    mask: options.mask,
    hashTracking: options.hashTracking,
    onClick: function(inst, i){},
    destroyAfterClose: options.destroyAfterClose
  });
};
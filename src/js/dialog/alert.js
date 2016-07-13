/**
 * 弹出提示框
 */
mdui.alert = function(text, title, onConfirm, option){
  if(typeof title === 'function'){
    title = '';
    onConfirm = arguments[1];
    option = arguments[2];
  }

  var DEFAULT = {
    cssClass: '',                 // 附加的 css 类
    buttonText: 'ok',             // 按钮上的文本
    buttonCssClass: '',           // 按钮上添加的 css 类
    closeBlur: false,             // 点击对话框外面区域关闭对话框
    closeEsc: true,               // 按下 esc 键关闭对话框
    mask: true,                   // 打开对话框时显示遮罩层
    hashTracking: true,           // hash跟踪
    onClick: function(inst){},    // 点击按钮回调
    destroyAfterClose: true       // 关闭后自动销毁
  };
  var options = $.extend({}, DEFAULT, option);

  return mdui.dialog({
    title: title,
    text: text,
    content: '',
    buttons: [
      {
        text: options.buttonText,
        cssClass: options.buttonCssClass,
        close: true,
        onClick: onConfirm
      }
    ],
    stackedButtons: false,
    cssClass: 'md-dialog-alert ' + options.cssClass,
    closeBlur: options.closeBlur,
    closeEsc: options.closeEsc,
    mask: options.mask,
    hashTracking: options.hashTracking,
    onClick: function(inst, i){},
    destroyAfterClose: options.destroyAfterClose
  });
};
/**
 * 弹出对话框函数
 * @param option
 * 参数：
 *  title           标题
 *  text            文本
 *  content         自定义内容
 *  buttons         按钮
 *  stackedButtons  是否垂直按钮
 *  cssClass        附加的css类
 *  closeBlur       点击对话框外面区域关闭对话框
 *  closeEsc        按下 esc 键关闭对话框
 *  mask            打开对话框时显示遮罩层
 *  hashTracking    hash跟踪
 *  onClick(inst, i)点击按钮回调
 *  destroyClose    关闭后自动销毁
 * 按钮参数：
 *  text            文本
 *  bold            是否加粗文本
 *  close           点击后是否关闭对话框
 *  onClick(inst)   点击回调
 */
mdui.dialog = function(option){
  var DEFAULT = {
    title: '',
    text: '',
    content: '',
    buttons: [],
    stackedButtons: false,
    cssClass: '',
    closeBlur: false,
    closeEsc: true,
    mask: true,
    hashTracking: true,
    onClick: function(inst, i){},
    destroyClose: true
  };
  var options = $.extend({}, DEFAULT, option);

  var buttonsHTML = '',
      dialogHTML;
  if(options.buttons && options.buttons.length > 0){
    for(var i = 0, len = options.buttons.length; i < len; i++){
      buttonsHTML += '<button class="md-btn md-text-color-primary' + (options.buttons[i].bold ? ' md-btn-bold' : '') + '">' + options.buttons[i].text + '</button>';
    }
  }
  var titleHTML = options.title ? '<div class="md-dialog-title">' + options.title + '</div>' : '';
  var textHTML = options.text ? '<div class="md-dialog-text">' + options.text + '</div>' : '';
  var contentHTML = options.content ? '<div class="md-dialog-content">' + options.content + '</div>' : '';
  var noButtonsClass = !options.buttons || options.buttons.length === 0 ? 'md-dialog-no-buttons' : '';
  var stackedButtonsClass = options.stackedButtons ? 'md-dialog-buttons-stacked' : '';
  var dialogButtonsHTML = options.buttons && options.buttons.length > 0 ? '<div class="md-dialog-buttons ">' + buttonsHTML + '</div>' : '';
  dialogHTML =
    '<div class="md-dialog-wrapper">' +
      '<div class="md-dialog ' + noButtonsClass + ' ' + stackedButtonsClass + ' ' + (options.cssClass || '') + '">' +
        '<div class="md-dialog-inner">' +
          titleHTML +
          textHTML +
          contentHTML +
        '</div>' +
        dialogButtonsHTML +
      '</div>' +
    '</div>';
  var $wrapper = $(dialogHTML);
  $(document.body).append($wrapper);

  var inst = new Dialog($wrapper, {
    onClick: function(inst, i){
      options.buttons[i].onClick(inst);
      options.onClick(inst, i);
      if(options.buttons[i].close){
        inst.close();
      }
    },
    closeBlur: options.closeBlur,
    closeEsc: options.closeEsc,
    mask: options.mask,
    hashTracking: options.hashTracking,
    destroyClose: true
  });
  inst.open();
};
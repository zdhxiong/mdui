/**
 * 弹出对话框函数
 * @param option
 */
mdui.dialog = function(option){
  //默认参数
  var DEFAULT = {
    title: '',                    // 标题
    text: '',                     // 文本
    content: '',                  // 自定义内容
    buttons: [                    // 按钮
      // {
      //   text: '',                   // 文本
      //   cssClass: '',               // 在按钮上添加的 css 类
      //   close: false,               // 点击后是否关闭对话框
      //   onClick: function(inst){}   // 点击回调
      // }
    ],
    stackedButtons: false,        // 是否垂直按钮
    cssClass: '',                 // 附加的css类
    closeBlur: true,              // 点击对话框外面区域关闭对话框
    closeEsc: true,               // 按下 esc 键关闭对话框
    mask: true,                   // 打开对话框时显示遮罩层
    hashTracking: true,           // hash跟踪
    onClick: function(inst, i){}, // 点击按钮回调
    destroyAfterClose: true       // 关闭后自动销毁
  };
  var options = $.extend({}, DEFAULT, option);

  // 创建 HTML 结构
  var buttonsHTML = '',
      dialogHTML;
  if(options.buttons && options.buttons.length > 0){
    for(var i = 0, len = options.buttons.length; i < len; i++){
      buttonsHTML += '<button class="md-btn md-ripple md-text-color-primary ' + options.buttons[i].cssClass + '">' + options.buttons[i].text + '</button>';
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

  var dialogOptions = {
    onClick: function(inst, i){
      // 指定按钮的回调
      if(typeof options.buttons[i].onClick === 'function'){
        options.buttons[i].onClick(inst);
      }
      // 所有按钮的回调
      if(typeof options.onClick === 'function'){
        options.onClick(inst, i);
      }

      // 必须把 close 操作放到最后
      // 在嵌套使用 dialog 时，先把需要打开的 dialog 放入队列，等旧 dialog 关闭后再从队列中打开新 dialog
      // 根据队列中是否有数据，决定是否需要隐藏遮罩、解锁屏幕
      if(options.buttons[i].close){
        inst.close();
      }
    },
    closeBlur: options.closeBlur,
    closeEsc: options.closeEsc,
    mask: options.mask,
    hashTracking: options.hashTracking,
    destroyAfterClose: options.destroyAfterClose
  };

  var inst = new Dialog($wrapper, dialogOptions);
  inst.open();

  return inst;
};
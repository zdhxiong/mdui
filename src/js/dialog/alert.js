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

  };

  mdui.dialog({
    title: title,
    text: text,
    buttons: [
      {
        text: 'ok',
        close: true,
        onClick: onConfirm
      }
    ]
  });

};
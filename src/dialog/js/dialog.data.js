$.ready(function () {
  // 实例化
  $.each(document.querySelectorAll('[data-md-dialog]'), function (index, target) {
    var options = $.parseOptions(target.getAttribute('data-md-dialog'));
    var inst = new mdui.Dialog(target, options);
    $.setData(target, 'dialog.mdui', inst);
  });

  // 操作按钮
  $.each(document.querySelectorAll('[data-md-dialog-action]'), function (index, btn) {
    var target, inst;


  });
});
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

    var action = btn.getAttribute('data-md-dialog-action');
    if (['open', 'close', 'toggle'].indexOf(action) === -1) {
      action = 'open';
    }

    var targetId = btn.getAttribute('data-md-dialog-id');
    if (!targetId) {
      var parent = $.parents(btn, '.md-dialog')[0];
      if(parent){
        // 如果操作按钮位于对话框中，且未指定对话框id，则默认操作该按钮所在的对话框
        target = parent;
      }else{
        target = document.querySelector('.md-dialog');
      }
    } else {
      target = document.getElementById(targetId);
    }
    if (!target) {
      return;
    }

    inst = $.getData(target, 'dialog.mdui');

    $.on(btn, 'click', function () {
      inst[action]();
    })

  });
});
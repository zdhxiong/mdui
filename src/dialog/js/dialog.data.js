$.ready(function () {
  // 实例化
  $.each( $.queryAll('[data-md-dialog]'), function (index, target) {
    var options = $.parseOptions(target.getAttribute('data-md-dialog'));
    var inst = new mdui.Dialog(target, options);
    $.setData(target, 'dialog.mdui', inst);
  });

  // 方法按钮
  var methods = ['open', 'close'];
  $.each(methods, function(i, method){
    $.each($.queryAll('[data-md-dialog-' + method + ']'), function(index, btn){
      var target, inst, trigger;

      // target
      var selector = btn.getAttribute('data-md-dialog-' + method);
      if(!selector){
        var parent = $.parents(btn, '.md-dialog')[0];
        if(parent){
          // 如果操作按钮位于对话框中，且未指定对话框id，则默认操作该按钮所在的对话框
          target = parent;
        }else{
          selector = '.md-dialog';
        }
      }
      if(!target){
        target = $.query(selector);
      }
      if(!target){
        return;
      }

      // inst
      inst = $.getData(target, 'dialog.mdui');

      // trigger
      trigger = btn.getAttribute('data-md-dialog-trigger');
      if(!trigger){
        trigger = 'click';
      }

      $.on(btn, trigger, function () {
        inst[method]();
      })
    });
  });
});
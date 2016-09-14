$.ready(function () {
  // 实例化
  $.each( $.queryAll('[data-md-drawer]'), function (index, target) {
    var options = $.parseOptions(target.getAttribute('data-md-drawer'));
    var inst = new mdui.Drawer(target, options);
    $.setData(target, 'drawer.mdui', inst);
  });

  // 方法按钮
  var methods = ['open', 'close', 'toggle'];
  $.each(methods, function(i, method){
    $.each($.queryAll('[data-md-drawer-' + method + ']'), function(index, btn){
      var target, inst, trigger;

      // target
      var selector = btn.getAttribute('data-md-drawer-' + method);
      if(!selector){
        var parent = $.parents(btn, '.md-drawer')[0];
        if(parent){
          target = parent;
        }else{
          selector = '.md-drawer';
        }
      }
      if(!target){
        target = $.query(selector);
      }
      if(!target){
        return;
      }

      // inst
      inst = $.getData(target, 'drawer.mdui');

      // trigger
      trigger = btn.getAttribute('data-md-drawer-trigger');
      if(!trigger){
        trigger = 'click';
      }

      $.on(btn, trigger, function () {
        inst[method]();
      });
    });
  });
});

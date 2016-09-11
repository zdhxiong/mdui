$.ready(function () {
  // 实例化
  $.each( $.queryAll('[data-md-drawer]'), function (index, target) {
    var options = $.parseOptions(target.getAttribute('data-md-drawer'));
    var inst = new mdui.Drawer(target, options);
    $.setData(target, 'drawer.mdui', inst);
  });

  // 操作按钮
  $.each( $.queryAll('[data-md-drawer-method]'), function (index, btn) {
    var target, inst, method, trigger;

    // target
    var selector = btn.getAttribute('data-md-drawer-target');
    if (!selector) {
      selector = '.md-drawer';
    }
    target = $.query(selector);
    if (!target) {
      return;
    }

    // inst
    inst = $.getData(target, 'drawer.mdui');

    // method
    method = btn.getAttribute('data-md-drawer-method');
    if(typeof inst[method] !== 'function'){
      method = 'toggle';
    }

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

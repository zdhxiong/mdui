$.ready(function () {
  // 实例化
  $.each(document.querySelectorAll('[data-md-drawer]'), function (index, target) {
    var options = $.parseOptions(target.getAttribute('data-md-drawer'));
    var inst = new mdui.Drawer(target, options);
    $.setData(target, 'drawer.mdui', inst);
  });

  // 操作按钮
  $.each(document.querySelectorAll('[data-md-drawer-action]'), function (index, btn) {
    var target, inst;

    var action = btn.getAttribute('data-md-drawer-action');
    if (['open', 'close', 'toggle'].indexOf(action) === -1) {
      action = 'toggle';
    }

    var targetId = btn.getAttribute('data-md-drawer-id');
    if (!targetId) {
      target = document.querySelector('.md-drawer');
    } else {
      target = document.getElementById(targetId);
    }
    if (!target) {
      return;
    }

    inst = $.getData(target, 'drawer.mdui');

    $.on(btn, 'click', function () {
      inst[action]();
    });
  });
});

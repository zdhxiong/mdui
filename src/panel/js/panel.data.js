/**
 * =============================================================================
 * ************   Expansion panel 自定义属性   ************
 * =============================================================================
 */

$.ready(function () {

  // 实例化插件
  $.each($.queryAll('[mdui-panel]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-panel'));

    var inst = $.data(target, 'mdui.panel');
    if (!inst) {
      inst = new mdui.Panel(target, options);
      $.data(target, 'mdui.panel', inst);
    }
  });
});

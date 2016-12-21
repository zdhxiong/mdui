/**
 * =============================================================================
 * ************   Collapsible 自定义属性   ************
 * =============================================================================
 */

$.ready(function () {

  // 实例化插件
  $.each($.queryAll('[mdui-collapsible]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-collapsible'));

    var inst = $.data(target, 'mdui.collapsible');
    if (!inst) {
      inst = new mdui.Collapsible(target, options);
      $.data(target, 'mdui.collapsible', inst);
    }
  });
});

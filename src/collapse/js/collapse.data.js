/**
 * =============================================================================
 * ************   Collapse 自定义属性   ************
 * =============================================================================
 */

$.ready(function () {

  // 实例化插件
  $.each($.queryAll('[mdui-collapse]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-collapse'));

    var inst = $.data(target, 'mdui.collapse');
    if (!inst) {
      inst = new mdui.Collapse(target, options);
      $.data(target, 'mdui.collapse', inst);
    }
  });
});

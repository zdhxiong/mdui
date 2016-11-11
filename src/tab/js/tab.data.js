/**
 * =============================================================================
 * ************   Tab 自定义属性 API   ************
 * =============================================================================
 */

$.ready(function () {

  // 实例化插件
  $.each($.queryAll('[mdui-tab]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-tab'));

    var inst = $.data(target, 'mdui.tab');
    if (!inst) {
      inst = new mdui.Tab(target, options);
      $.data(target, 'mdui.tab', inst);
    }
  });
});

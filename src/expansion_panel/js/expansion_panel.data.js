/**
 * =============================================================================
 * ************   Expansion panel 自定义属性   ************
 * =============================================================================
 */

$.ready(function () {

  // 实例化插件
  $.each($.queryAll('[mdui-expansion-panel]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-expansion-panel'));

    var inst = $.data(target, 'mdui-expansion-panel');
    if (!inst) {
      inst = new mdui.ExpansionPanel(target, options);
      $.data(target, 'mdui.expansion_panel', inst);
    }
  });
});

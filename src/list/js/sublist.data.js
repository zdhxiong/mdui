/**
 * =============================================================================
 * ************   Sublist 自定义属性   ************
 * =============================================================================
 */

$.ready(function () {

  $.each($.queryAll('[mdui-sublist]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-sublist'));

    var inst = $.data(target, 'mdui.sublist');
    if (!inst) {
      inst = new mdui.Sublist(target, options);
      $.data(target, 'mdui.sublist', inst);
    }
  });
});

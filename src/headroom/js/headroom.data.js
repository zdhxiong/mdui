/**
 * =============================================================================
 * ************   Headroom 自定义属性 API   ************
 * =============================================================================
 */

$.ready(function () {

  $.each($.queryAll('[mdui-headroom]'), function (i, target) {
    var options = $.parseOptions(target.getAttribute('mdui-headroom'));

    var inst = $.data(target, 'mdui.headroom');
    if (!inst) {
      inst = new mdui.Headroom(target, options);
      $.data(target, 'mdui.headroom', inst);
    }
  });
});

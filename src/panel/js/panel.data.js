/**
 * =============================================================================
 * ************   Expansion panel 自定义属性   ************
 * =============================================================================
 */

$(function () {
  $('[mdui-panel]').each(function () {
    var $target = $(this);

    var inst = $target.data('mdui.panel');
    if (!inst) {
      var options = parseOptions($target.attr('mdui-panel'));
      inst = new mdui.Panel($target, options);
      $target.data('mdui.panel', inst);
    }
  });
});

/**
 * =============================================================================
 * ************   Collapse 自定义属性   ************
 * =============================================================================
 */

$(function () {
  mdui.mutation('[mdui-collapse]', function () {
    var $target = $(this);

    var inst = $target.data('mdui.collapse');
    if (!inst) {
      var options = parseOptions($target.attr('mdui-collapse'));
      inst = new mdui.Collapse($target, options);
      $target.data('mdui.collapse', inst);
    }
  });
});

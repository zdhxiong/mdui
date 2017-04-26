/**
 * =============================================================================
 * ************   Collapse 自定义属性   ************
 * =============================================================================
 */

$(function () {
  $('[mdui-collapse]').each(function () {
    var $this = $(this);
    var options = parseOptions($this.attr('mdui-collapse'));

    var inst = $this.data('mdui.collapse');
    if (!inst) {
      inst = new mdui.Collapse($this, options);
      $this.data('mdui.collapse', inst);
    }
  });
});

/**
 * =============================================================================
 * ************   Tab 自定义属性 API   ************
 * =============================================================================
 */

$(function () {
  $('[mdui-tab]').each(function () {
    var $this = $(this);
    var inst = $this.data('mdui.tab');
    if (!inst) {
      inst = new mdui.Tab($this, parseOptions($this.attr('mdui-tab')));
      $this.data('mdui.tab', inst);
    }
  });
});

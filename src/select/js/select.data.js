/**
 * =============================================================================
 * ************   Select 下拉选择   ************
 * =============================================================================
 */

$(function () {
  mdui.mutation('[mdui-select]', function () {
    var $this = $(this);
    var inst = $this.data('mdui.select');
    if (!inst) {
      inst = new mdui.Select($this, parseOptions($this.attr('mdui-select')));
      $this.data('mdui.select', inst);
    }
  });
});

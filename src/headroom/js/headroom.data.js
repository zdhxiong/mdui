/**
 * =============================================================================
 * ************   Headroom 自定义属性 API   ************
 * =============================================================================
 */

$(function () {
  $('[mdui-headroom]').each(function () {
    var $this = $(this);
    var options = parseOptions($this.attr('mdui-headroom'));

    var inst = $this.data('mdui.headroom');
    if (!inst) {
      inst = new mdui.Headroom($this, options);
      $this.data('mdui.headroom', inst);
    }
  });
});

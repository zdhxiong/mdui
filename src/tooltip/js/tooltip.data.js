/**
 * =============================================================================
 * ************   Tooltip DATA API   ************
 * =============================================================================
 */

$(function () {
  // mouseenter 不能冒泡，所以这里用 mouseover 代替
  $document.on('touchstart mouseover', '[mdui-tooltip]', function () {
    var $this = $(this);

    var inst = $this.data('mdui.tooltip');
    if (!inst) {
      var options = parseOptions($this.attr('mdui-tooltip'));
      inst = new mdui.Tooltip($this, options);
      $this.data('mdui.tooltip', inst);

      inst.open();
    }
  });
});

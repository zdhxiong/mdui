/**
 * =============================================================================
 * ************   Fab DATA API   ************
 * =============================================================================
 */

$(function () {
  // mouseenter 不冒泡，无法进行事件委托，这里用 mouseover 代替。
  // 不管是 click 、 mouseover 还是 touchstart ，都先初始化。

  $document.on('touchstart mousedown mouseover', '[mdui-fab]', function (e) {
    var $this = $(this);

    var inst = $this.data('mdui.fab');
    if (!inst) {
      var options = parseOptions($this.attr('mdui-fab'));
      inst = new mdui.Fab($this, options);
      $this.data('mdui.fab', inst);
    }
  });
});

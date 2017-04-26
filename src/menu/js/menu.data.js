/**
 * =============================================================================
 * ************   Menu 自定义属性 API   ************
 * =============================================================================
 */

$(function () {
  $document.on('click', '[mdui-menu]', function () {
    var $this = $(this);

    var inst = $this.data('mdui.menu');
    if (!inst) {
      var options = parseOptions($this.attr('mdui-menu'));
      var menuSelector = options.target;
      delete options.target;

      inst = new mdui.Menu($this, menuSelector, options);
      $this.data('mdui.menu', inst);

      inst.toggle();
    }
  });
});

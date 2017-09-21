/**
 * =============================================================================
 * ************   Drawer 自定义属性 API   ************
 * =============================================================================
 */

$(function () {
  $document.on('click', '[mdui-drawer]', function () {
    var $this = $(this);
    var options = parseOptions($this.attr('mdui-drawer'));
    var $drawer = $(options.target).eq(0);

    var inst = $drawer.data('mdui.drawer');
    if (!inst) {
      inst = new mdui.Drawer($drawer, options);
      $drawer.data('mdui.drawer', inst);
    }

    inst.toggle();
  });
});

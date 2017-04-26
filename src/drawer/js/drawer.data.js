/**
 * =============================================================================
 * ************   Drawer 自定义属性 API   ************
 * =============================================================================
 */

$(function () {
  $('[mdui-drawer]').each(function () {
    var $this = $(this);
    var options = parseOptions($this.attr('mdui-drawer'));
    var selector = options.target;
    delete options.target;

    var $drawer = $(selector).eq(0);

    var inst = $drawer.data('mdui.drawer');
    if (!inst) {
      inst = new mdui.Drawer($drawer, options);
      $drawer.data('mdui.drawer', inst);
    }

    $this.on('click', function () {
      inst.toggle();
    });
  });
});

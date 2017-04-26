/**
 * =============================================================================
 * ************   Dialog DATA API   ************
 * =============================================================================
 */

$(function () {
  $document.on('click', '[mdui-dialog]', function () {
    var $this = $(this);
    var options = parseOptions($this.attr('mdui-dialog'));
    var selector = options.target;
    delete options.target;

    var $dialog = $(selector).eq(0);

    var inst = $dialog.data('mdui.dialog');
    if (!inst) {
      inst = new mdui.Dialog($dialog, options);
      $dialog.data('mdui.dialog', inst);
    }

    inst.open();
  });
});

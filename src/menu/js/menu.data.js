/**
 * =============================================================================
 * ************   Menu 自定义属性 API   ************
 * =============================================================================
 */

$.ready(function () {

  $.on(document, 'click', '[mdui-menu]', function () {
    var _this = this;
    var options = $.parseOptions(_this.getAttribute('mdui-menu'));
    var menuSelector = options.target;
    delete options.target;

    var inst = $.getData(_this, 'mdui.dialog');
    if (!inst) {
      inst = new mdui.Menu(_this, menuSelector, options);
      $.setData(_this, 'mdui.menu', inst);
    }

    inst.toggle();
  });
});

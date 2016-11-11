/**
 * =============================================================================
 * ************   Menu 自定义属性 API   ************
 * =============================================================================
 */

$.ready(function () {

  $.on(document, 'click', '[mdui-menu]', function () {
    var _this = this;

    var inst = $.data(_this, 'mdui.menu');
    if (!inst) {
      var options = $.parseOptions(_this.getAttribute('mdui-menu'));
      var menuSelector = options.target;
      delete options.target;

      inst = new mdui.Menu(_this, menuSelector, options);
      $.data(_this, 'mdui.menu', inst);

      inst.toggle();
    }
  });
});

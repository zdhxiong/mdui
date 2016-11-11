/**
 * =============================================================================
 * ************   Tooltip DATA API   ************
 * =============================================================================
 */

(function () {
  // mouseenter 不能冒泡，所以这里用 mouseover 代替
  var event = mdui.support.touch ? 'touchstart' : 'mouseover';

  $.on(document, event, '[mdui-tooltip]', function () {
    var _this = this;

    var inst = $.data(_this, 'mdui.tooltip');
    if (!inst) {
      var options = $.parseOptions(_this.getAttribute('mdui-tooltip'));
      inst = new mdui.Tooltip(_this, options);
      $.data(_this, 'mdui.tooltip', inst);

      inst.open();
    }
  });
})();

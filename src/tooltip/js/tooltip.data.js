/**
 * =============================================================================
 * ************   Tooltip DATA API   ************
 * =============================================================================
 */

(function () {
  // mouseenter 不能冒泡，所以这里用 mouseover 代替
  var event = mdui.support.touch ? 'touchstart' : 'mouseover';

  $.on(document, event, '[data-md-tooltip]', function () {
    var target = this;

    var inst = $.getData(target, 'mdui.tooltip');
    if (!inst) {
      var options = $.parseOptions(target.getAttribute('data-md-tooltip'));
      inst = new mdui.Tooltip(target, options);
      $.setData(target, 'mdui.tooltip', inst);

      inst.open();
    }
  });
})();

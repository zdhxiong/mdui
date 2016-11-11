/**
 * =============================================================================
 * ************   Fab DATA API   ************
 * =============================================================================
 */

$.ready(function () {

  // mouseenter 不冒泡，无法进行事件委托，这里用 mouseover 代替。
  // 不管是 click 、 mouseover 还是 touchstart ，都先初始化。
  var event = mdui.support.touch ? 'touchstart' : 'click mouseover';

  $.on(document, event, '[mdui-fab]', function (e) {
    var _this = this;
    var eventType = e.type;

    var inst = $.data(_this, 'mdui.fab');
    if (!inst) {
      var options = $.parseOptions(_this.getAttribute('mdui-fab'));
      inst = new mdui.Fab(_this, options);
      $.data(_this, 'mdui.fab', inst);

      // 判断当前事件
      if (eventType === 'touchstart') {
        inst.open();
      }else if (
        (inst.options.trigger === 'click' && eventType === 'click') ||
        (inst.options.trigger === 'hover' && eventType === 'mouseover')
      ) {
        inst.open();
      }
    }
  });
});

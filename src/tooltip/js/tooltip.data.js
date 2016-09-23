/**
 * Tooltip 工具提示
 * =============================================================================
 */

(function(){
  var showEvent, hideEvent;
  if(mdui.support.touch) {
    showEvent = 'touchstart';
    hideEvent = 'touchend';
  }else{
    showEvent = 'mouseenter';
    hideEvent = 'mouseleave';
  }

  $.on(document, 'mouseenter', '[data-md-tooltip]', function(e){
    console.log(e);
    var target = e.target;
    var options = $.parseOptions(target.getAttribute('data-md-tooltip'));

    var inst = $.getData(target, 'tooltip.mdui');
    if(!inst){
      inst = new mdui.Tooltip(target, options);
      $.setData(target, 'tooltip.mdui', inst);
    }

    inst.open(options);
  });

  $.on(document, hideEvent, '[data-md-tooltip]', function(e){
    var target = e.target;
    var inst = $.getData(target, 'tooltip.mdui');
    inst.close();
  });
})();
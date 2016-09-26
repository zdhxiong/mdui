$.ready(function(){

  var event;
  if(mdui.support.touch){
    event = 'touchstart';
  }else{
    // mouseenter 不冒泡，无法进行事件委托，这里用 mouseover 代替
    event = 'click mouseover';
  }

  $.on(document, event, '[data-md-fab]', function(e){
    var fab = this;
    var eventType = e.type;

    // 不管是 click 、 mouseover 还是 touchstart ，都先初始化。
    var inst = $.getData(fab, 'mdui.fab');
    if(!inst){
      var options = $.parseOptions(fab.getAttribute('data-md-fab'));
      inst = new mdui.Fab(fab, options);
      $.setData(fab, 'mdui.fab', inst);

      // 判断当前事件
      if(mdui.support.touch){
        if(eventType === 'touchstart'){
          inst.open();
        }
      }else{
        if(inst.options.trigger === 'click' && eventType === 'click'){
          inst.open();
        }
        if(inst.options.trigger === 'hover' && eventType === 'mouseover'){
          inst.open();
        }
      }
    }
  });
});
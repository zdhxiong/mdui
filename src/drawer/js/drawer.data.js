$.ready(function () {

  // 实例化插件
  $.each( $.queryAll('[data-md-drawer]'), function(i, target){
    var options = $.parseOptions(target.getAttribute('data-md-drawer'));
    var selector = options.target;
    delete options.target;

    var drawer = $.dom(selector)[0];

    var inst = $.getData(drawer, 'mdui.drawer');
    if(!inst){
      inst = new mdui.Drawer(drawer, options);
      $.setData(drawer, 'mdui.drawer', inst);
    }

    $.on(target, 'click', function(){
      inst.toggle();
    })
  });

});

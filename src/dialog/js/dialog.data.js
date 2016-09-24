$.ready(function () {

  $.on(document, 'click', '[data-md-dialog]', function(e){
    var target = e.target;
    var options = $.parseOptions(target.getAttribute('data-md-dialog'));
    var selector = options.target;
    delete options.target;

    var dialog = $.dom(selector)[0];

    var inst = $.getData(dialog, 'mdui.dialog');
    if(!inst){
      inst = new mdui.Dialog(dialog, options);
      $.setData(dialog, 'mdui.dialog', inst);
    }

    inst.open();
  });

});
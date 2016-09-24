$.ready(function () {

  $.on(document, 'click', '[data-md-dialog]', function(e){
    var target = e.target;
    var inst;

    inst = $.getData(target, 'inst.mdui.dialog');
    if(!inst){
      var options = $.parseOptions(target.getAttribute('data-md-dialog'));

      var selector = options.target;
      delete options.target;

      inst = new mdui.Dialog(selector, options);
      $.setData(target, 'inst.mdui.dialog', inst);
    }

    inst.open();
  });

});
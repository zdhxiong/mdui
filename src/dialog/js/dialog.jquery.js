(function($){

  function Plugin(option){
    var value;

    this.each(function(){
      var $this = $(this);
      var inst = $this.data('inst.mdui.dialog');

      if(!inst){
        $this.data('inst.mdui.dialog', (inst = new mdui.Dialog(this, option)));
      }
      if(typeof option === 'string'){
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mdDialog;

  $.fn.mdDialog = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mdDialog.noConflict = function(){
    $.fn.mdDialog = old;
    return this;
  };
})(jQuery);
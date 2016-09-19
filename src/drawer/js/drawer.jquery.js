(function($){

  function Plugin(option){
    var value;

    this.each(function(){
      var $this = $(this);
      var inst = $this.data('drawer.mdui');

      if(!inst){
        $this.data('drawer.mdui', (inst = new mdui.Drawer(this, option)));
      }
      if(typeof option === 'string'){
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mdDrawer;

  $.fn.mdDrawer = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mdDrawer.noConflict = function(){
    $.fn.mdDrawer = old;
    return this;
  };
})(jQuery);
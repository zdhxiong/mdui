/**
 * =============================================================================
 * ************   Fab jQuery   ************
 * =============================================================================
 */

(function () {

  function Plugin(option) {
    var value;

    this.each(function () {
      var $this = $(this);
      var inst = $this.data('mdui.fab');

      if (!inst) {
        $this.data('mdui.fab', (inst = new mdui.Fab(this, option)));
      }

      if (typeof option === 'string') {
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mduiFab;

  $.fn.mduiFab = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mduiFab.noConflict = function () {
    $.fn.mduiFab = old;
    return this;
  };
})();

/**
 * =============================================================================
 * ************   Tab jQuery   ************
 * =============================================================================
 */

(function ($) {

  function Plugin(option) {
    var value;

    this.each(function () {
      var $this = $(this);
      var inst = $this.data('mdui.tab');

      if (!inst) {
        $this.data('mdui.tab', (inst = new mdui.Dialog(this, option)));
      }

      if (typeof option === 'string') {
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mduiTab;

  $.fn.mduiTab = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mduiTab.noConflict = function () {
    $.fn.mduiTab = old;
    return this;
  };
})(jQuery);

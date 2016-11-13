/**
 * =============================================================================
 * ************   Expansion panel jQuery   ************
 * =============================================================================
 */

(function ($) {

  function Plugin(option) {
    var value;

    this.each(function () {
      var $this = $(this);
      var inst = $this.data('mdui.panel');

      if (!inst) {
        $this.data('mdui.panel', (inst = new mdui.Panel(this, option)));
      }

      if (typeof option === 'string') {
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mduiPanel;

  $.fn.mduiPanel = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mduiPanel.noConflict = function () {
    $.fn.mduiPanel = old;
    return this;
  };
})(jQuery);

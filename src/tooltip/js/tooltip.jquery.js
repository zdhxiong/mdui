/**
 * =============================================================================
 * ************   Tooltip jQuery   ************
 * =============================================================================
 */

(function ($) {

  function Plugin(option) {
    var value;

    this.each(function () {
      var $this = $(this);
      var inst = $this.data('mdui.tooltip');

      if (!inst) {
        $this.data('mdui.tooltip', (inst = new mdui.Tooltip(this, option)));
      }

      if (typeof option === 'string') {
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mduiTooltip;

  $.fn.mduiTooltip = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mduiTooltip.noConflict = function () {
    $.fn.mduiTooltip = old;
    return this;
  };
})(jQuery);

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
      var inst = $this.data('mdui.expansion_panel');

      if (!inst) {
        $this.data('mdui.expansion_panel', (inst = new mdui.ExpansionPanel(this, option)));
      }

      if (typeof option === 'string') {
        value = inst[option]();
      }
    });

    return typeof value === 'undefined' ? this : value;
  }

  var old = $.fn.mduiExpansionPanel;

  $.fn.mduiExpansionPanel = Plugin;

  // NO CONFLICT
  // ===========
  $.fn.mduiExpansionPanel.noConflict = function () {
    $.fn.mduiExpansionPanel = old;
    return this;
  };
})(jQuery);

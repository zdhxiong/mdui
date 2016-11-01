/**
 * =============================================================================
 * ************   Expansion panel 可扩展面板   ************
 * =============================================================================
 */

(function () {

  $.on(document, 'click', '.mdui-expansion-panel-collapsed', function () {
    var _this = this;

    if (_this.classList.contains('mdui-expansion-panel-open')) {
      _this.classList.remove('mdui-expansion-panel-open');
    } else {
      _this.classList.add('mdui-expansion-panel-open');
    }
  });

})();

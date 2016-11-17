/**
 * =============================================================================
 * ************   Spinner 圆形进度条   ************
 * =============================================================================
 */

(function () {
  /**
   * layer 的 HTML 结构
   */
  var layerHTML = function () {
    var i = arguments.length === 1 ? arguments[0] : false;

    return '<div class="mdui-spinner-layer ' + (i ? 'mdui-spinner-layer-' + i : '') + '">' +
               '<div class="mdui-spinner-circle-clipper mdui-spinner-left">' +
             '<div class="mdui-spinner-circle"></div>' +
             '</div>' +
             '<div class="mdui-spinner-gap-patch">' +
               '<div class="mdui-spinner-circle"></div>' +
             '</div>' +
             '<div class="mdui-spinner-circle-clipper mdui-spinner-right">' +
               '<div class="mdui-spinner-circle"></div>' +
             '</div>' +
           '</div>';
  };

  /**
   * 填充 HTML
   * @param spinner
   */
  var fillHTML = function (spinner) {
    var layer;
    if (spinner.classList.contains('mdui-spinner-colorful')) {
      layer = layerHTML('1') + layerHTML('2') + layerHTML('3') + layerHTML('4');
    } else {
      layer = layerHTML();
    }

    spinner.innerHTML = layer;
  };

  /**
   * 页面加载完后自动填充 HTML 结构
   */
  $.ready(function () {
    var spinners = $.queryAll('.mdui-spinner');
    $.each(spinners, function (i, spinner) {
      fillHTML(spinner);
    });
  });

  /**
   * 更新圆形进度条
   */
  mdui.updateSpinners = function () {
    var spinners;

    if (arguments.length === 1) {
      spinners = $.dom(arguments[0]);
    } else {
      spinners = $.queryAll('.mdui-spinner');
    }

    $.each(spinners, function (i, spinner) {
      fillHTML(spinner);
    });
  };

})();


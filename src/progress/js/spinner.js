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
    var i = arguments.length ? arguments[0] : false;

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
    var $spinner = $(spinner);
    var layer;
    if ($spinner.hasClass('mdui-spinner-colorful')) {
      layer = layerHTML('1') + layerHTML('2') + layerHTML('3') + layerHTML('4');
    } else {
      layer = layerHTML();
    }

    $spinner.html(layer);
  };

  /**
   * 页面加载完后自动填充 HTML 结构
   */
  $(function () {
    $('.mdui-spinner').each(function () {
      fillHTML(this);
    });
  });

  /**
   * 更新圆形进度条
   */
  mdui.updateSpinners = function () {
    $(arguments.length ? arguments[0] : '.mdui-spinner').each(function () {
      fillHTML(this);
    });
  };

})();


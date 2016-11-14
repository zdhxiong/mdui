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
   * 默认参数
   */
  var DEFAULT = {
    colorful: false,
    active: true,
  };

  /**
   * 填充 HTML
   * @param spinner
   * @param options
   */
  var fillHTML = function (spinner, options) {
    var layer;
    if (options.colorful) {
      layer = layerHTML('1') + layerHTML('2') + layerHTML('3') + layerHTML('4');
    } else {
      layer = layerHTML();
    }

    spinner.classList[options.active ? 'add' : 'remove']('mdui-spinner-active');

    spinner.innerHTML(layer);
  };

  /**
   * 页面加载完后自动填充 HTML 结构
   */
  $.ready(function () {
    var spinners = $.queryAll('[mdui-spinner]');
    $.each(spinners, function (i, spinner) {
      var options = $.parseOptions(spinner.getAttribute('[mdui-spinner]'));
      options = $.extend(DEFAULT, options);

      fillHTML(spinner, options);
    });
  });

  /**
   * 更新圆形进度条
   */
  mdui.updateSpinners = function () {
    var spinners;
    var opts = {};

    if (arguments.length === 0) {
      spinners = $.queryAll('.mdui-spinner');
    } else if (arguments.length <= 2) {
      spinners = $.dom(arguments[0]);

      if (arguments.length === 2) {
        opts = arguments[1];
      }
    }

    $.each(spinners, function (i, spinner) {
      var options = $.extend(DEFAULT, opts);

      fillHTML(spinner, options);
    });

  };

})();


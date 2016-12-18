/**
 * =============================================================================
 * ************   Snackbar   ************
 * =============================================================================
 */

(function () {

  /**
   * 当前打开着的 Snackbar
   */
  var current;

  /**
   * 对列名
   * @type {string}
   */
  var queueName = '__md_snackbar';

  var DEFAULT = {
    message: '',                    // 文本内容
    timeout: 4000,                  // 在用户没有操作时多长时间自动隐藏
    buttonText: '',                 // 按钮的文本
    buttonColor: '',                // 按钮的颜色，支持 blue #90caf9 rgba(...)
    closeOnButtonClick: true,       // 点击按钮时关闭
    closeOnOutsideClick: true,      // 触摸或点击屏幕其他地方时关闭
    onClick: function () {          // 在 Snackbar 上点击的回调
    },

    onButtonClick: function () {    // 点击按钮的回调
    },

    onClose: function () {          // 关闭动画开始时的回调
    },
  };

  /**
   * 点击 Snackbar 外面的区域关闭
   * @param e
   */
  var closeOnOutsideClick = function (e) {
    if (
      !e.target.classList.contains('mdui-snackbar') &&
      !$.parents(e.target, '.mdui-snackbar').length
    ) {
      current.close();
    }
  };

  /**
   * Snackbar 实例
   * @param opts
   * @constructor
   */
  function Snackbar(opts) {
    var _this = this;

    _this.options = $.extend(DEFAULT, (opts || {}));

    // message 参数必须
    if (!_this.options.message) {
      return;
    }

    _this.state = 'closed';

    // 按钮颜色
    var buttonColorStyle = '';
    var buttonColorClass = '';

    if (
      _this.options.buttonColor.indexOf('#') === 0 ||
      _this.options.buttonColor.indexOf('rgb') === 0
    ) {
      buttonColorStyle = 'style="color:' + _this.options.buttonColor + '"';
    }else if (_this.options.buttonColor !== '') {
      buttonColorClass = 'mdui-text-color-' + _this.options.buttonColor;
    }

    // 添加 HTML
    var tpl =
      '<div class="mdui-snackbar ' +
          (mdui.screen.mdUp() ? 'mdui-snackbar-desktop' : 'mdui-snackbar-mobile') +
      '">' +
        '<div class="mdui-snackbar-text">' +
          _this.options.message +
        '</div>' +
        (_this.options.buttonText ?
          ('<a href="javascript:void(0)" ' +
          'class="mdui-snackbar-action mdui-btn mdui-ripple mdui-ripple-white ' +
            buttonColorClass + '" ' +
            buttonColorStyle + '>' +
            _this.options.buttonText +
          '</a>') :
          ''
        ) +
      '</div>';
    _this.snackbar = $.dom(tpl)[0];
    document.body.appendChild(_this.snackbar);

    // 设置位置
    $.transform(_this.snackbar, 'translateY(' + _this.snackbar.clientHeight + 'px)');
    _this.snackbar.style.left = (document.body.clientWidth - _this.snackbar.clientWidth) / 2 + 'px';
    _this.snackbar.classList.add('mdui-snackbar-transition');
  }

  /**
   * 打开 Snackbar
   */
  Snackbar.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    // 如果当前有正在显示的 Snackbar，则先加入队列，等旧 Snackbar 关闭后再打开
    if (current) {
      $.queue(queueName, function () {
        _this.open();
      });

      return;
    }

    current = _this;

    // 开始打开
    _this.state = 'opening';
    $.transform(_this.snackbar, 'translateY(0)');

    $.transitionEnd(_this.snackbar, function () {
      if (_this.state !== 'opening') {
        return;
      }

      _this.state = 'opened';

      // 有按钮时绑定事件
      if (_this.options.buttonText) {
        var action = $.query('.mdui-snackbar-action', _this.snackbar);
        $.on(action, 'click', function () {
          _this.options.onButtonClick();
          if (_this.options.closeOnButtonClick) {
            _this.close();
          }
        });
      }

      // 点击 Snackbar 的事件
      $.on(_this.snackbar, 'click', function (e) {
        if (!e.target.classList.contains('mdui-snackbar-action')) {
          _this.options.onClick();
        }
      });

      // 点击 Snackbar 外面的区域关闭
      if (_this.options.closeOnOutsideClick) {
        $.on(document, mdui.support.touch ? 'touchstart' : 'click', closeOnOutsideClick);
      }

      // 超时后自动关闭
      _this.timeoutId = setTimeout(function () {
        _this.close();
      }, _this.options.timeout);

    });
  };

  /**
   * 关闭 Snackbar
   */
  Snackbar.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    if (typeof _this.timeoutId !== 'undefined') {
      clearTimeout(_this.timeoutId);
    }

    if (_this.options.closeOnOutsideClick) {
      $.off(document, mdui.support.touch ? 'touchstart' : 'click', closeOnOutsideClick);
    }

    _this.state = 'closing';
    $.transform(_this.snackbar, 'translateY(' + _this.snackbar.clientHeight + 'px)');
    _this.options.onClose();

    $.transitionEnd(_this.snackbar, function () {
      if (_this.state !== 'closing') {
        return;
      }

      current = null;
      _this.state = 'closed';
      $.remove(_this.snackbar);
      $.dequeue(queueName);
    });
  };

  /**
   * 打开 Snackbar
   * @param params
   */
  mdui.snackbar = function (params) {
    var inst = new Snackbar(params);

    inst.open();
    return inst;
  };

})();

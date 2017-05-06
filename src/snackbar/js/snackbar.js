/**
 * =============================================================================
 * ************   Snackbar   ************
 * =============================================================================
 */

(function () {

  /**
   * 当前打开着的 Snackbar
   */
  var currentInst;

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
    var $target = $(e.target);
    if (!$target.hasClass('mdui-snackbar') && !$target.parents('.mdui-snackbar').length) {
      currentInst.close();
    }
  };

  /**
   * Snackbar 实例
   * @param opts
   * @constructor
   */
  function Snackbar(opts) {
    var _this = this;

    _this.options = $.extend({}, DEFAULT, (opts || {}));

    // message 参数必须
    if (!_this.options.message) {
      return;
    }

    _this.state = 'closed';

    _this.timeoutId = false;

    // 按钮颜色
    var buttonColorStyle = '';
    var buttonColorClass = '';

    if (
      _this.options.buttonColor.indexOf('#') === 0 ||
      _this.options.buttonColor.indexOf('rgb') === 0
    ) {
      buttonColorStyle = 'style="color:' + _this.options.buttonColor + '"';
    } else if (_this.options.buttonColor !== '') {
      buttonColorClass = 'mdui-text-color-' + _this.options.buttonColor;
    }

    // 添加 HTML
    _this.$snackbar = $(
      '<div class="mdui-snackbar">' +
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
      '</div>')
      .appendTo(document.body);

    // 设置位置
    _this.$snackbar
      .transform('translateY(' + _this.$snackbar[0].clientHeight + 'px)')
      .css('left', (document.body.clientWidth - _this.$snackbar[0].clientWidth) / 2 + 'px')
      .addClass('mdui-snackbar-transition');
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
    if (currentInst) {
      queue.queue(queueName, function () {
        _this.open();
      });

      return;
    }

    currentInst = _this;

    // 开始打开
    _this.state = 'opening';
    _this.$snackbar
      .transform('translateY(0)')
      .transitionEnd(function () {
        if (_this.state !== 'opening') {
          return;
        }

        _this.state = 'opened';

        // 有按钮时绑定事件
        if (_this.options.buttonText) {
          _this.$snackbar
            .find('.mdui-snackbar-action')
            .on('click', function () {
              _this.options.onButtonClick();
              if (_this.options.closeOnButtonClick) {
                _this.close();
              }
            });
        }

        // 点击 snackbar 的事件
        _this.$snackbar.on('click', function (e) {
          if (!$(e.target).hasClass('mdui-snackbar-action')) {
            _this.options.onClick();
          }
        });

        // 点击 Snackbar 外面的区域关闭
        if (_this.options.closeOnOutsideClick) {
          $document.on(TouchHandler.start, closeOnOutsideClick);
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

    if (_this.timeoutId) {
      clearTimeout(_this.timeoutId);
    }

    if (_this.options.closeOnOutsideClick) {
      $document.off(TouchHandler.start, closeOnOutsideClick);
    }

    _this.state = 'closing';
    _this.options.onClose();

    _this.$snackbar
      .transform('translateY(' + _this.$snackbar[0].clientHeight + 'px)')
      .transitionEnd(function () {
        if (_this.state !== 'closing') {
          return;
        }

        currentInst = null;
        _this.state = 'closed';
        _this.$snackbar.remove();
        queue.dequeue(queueName);
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

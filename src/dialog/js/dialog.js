/**
 * =============================================================================
 * ************   Dialog 对话框   ************
 * =============================================================================
 */

mdui.Dialog = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    history: true,                // 监听 hashchange 事件
    overlay: true,                // 打开对话框时显示遮罩
    modal: false,                 // 是否模态化对话框，为 false 时点击对话框外面区域关闭对话框，为 true 时不关闭
    closeOnEsc: true,             // 按下 esc 关闭对话框
    closeOnCancel: true,          // 按下取消按钮时关闭对话框
    closeOnConfirm: true,         // 按下确认按钮时关闭对话框
    destroyOnClosed: false,        // 关闭后销毁
  };

  /**
   * 遮罩层元素
   */
  var overlay;

  /**
   * 窗口是否已锁定
   */
  var isLockScreen;

  /**
   * 当前对话框
   */
  var current;

  /**
   * 队列名
   * @type {string}
   */
  var queueName = '__md_dialog';

  /**
   * 窗口宽度变化，或对话框内容变化时，调整对话框位置和对话框内的滚动条
   */
  var readjust = function () {
    if (!current) {
      return;
    }

    var dialog = current.dialog;

    var dialogTitle = $.child(dialog, '.mdui-dialog-title');
    var dialogContent = $.child(dialog, '.mdui-dialog-content');
    var dialogActions = $.child(dialog, '.mdui-dialog-actions');

    // 调整 dialog 的 top 和 height 值
    dialog.style.height = '';
    if (dialogContent) {
      dialogContent.style.height = '';
    }

    var dialogHeight = dialog.clientHeight;
    dialog.style.top = ((window.innerHeight - dialogHeight) / 2) + 'px';
    dialog.style.height = dialogHeight + 'px';

    // 调整 mdui-dialog-content 的高度
    var dialogTitleHeight = dialogTitle ? dialogTitle.scrollHeight : 0;
    var dialogActionsHeight = dialogActions ? dialogActions.scrollHeight : 0;
    if (dialogContent) {
      dialogContent.style.height = dialogHeight - dialogTitleHeight - dialogActionsHeight + 'px';
    }
  };

  /**
   * hashchange 事件触发时关闭对话框
   */
  var hashchangeEvent = function () {
    if (location.hash.substring(1).indexOf('&mdui-dialog') < 0) {
      current.close(true);
    }
  };

  /**
   * 点击遮罩层关闭对话框
   * @param e
   */
  var overlayClick = function (e) {
    if (e.target.classList.contains('mdui-overlay')) {
      current.close();
    }
  };

  /**
   * 对话框实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Dialog(selector, opts) {
    var _this = this;

    // 对话框元素
    _this.dialog = $.dom(selector)[0];
    if (typeof _this.dialog === 'undefined') {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.data(_this.dialog, 'mdui.dialog');
    if (oldInst) {
      return oldInst;
    }

    // 如果对话框元素没有在当前文档中，则需要添加
    if (!document.body.contains(_this.dialog)) {
      _this.append = true;
      document.body.appendChild(_this.dialog);
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 在不支持触摸的设备上美化滚动条
    if (!mdui.support.touch) {
      var content = $.query('.mdui-dialog-content', _this.dialog);
      if (content) {
        content.classList.add('mdui-dialog-scrollbar');
      }
    }

    // 绑定取消按钮事件
    var cancels = $.queryAll('[mdui-dialog-cancel]', _this.dialog);
    $.each(cancels, function (i, cancel) {
      $.on(cancel, 'click', function () {
        $.pluginEvent('cancel', 'dialog', _this, _this.dialog);
        if (_this.options.closeOnCancel) {
          _this.close();
        }
      });
    });

    // 绑定确认按钮事件
    var confirms = $.queryAll('[mdui-dialog-confirm]', _this.dialog);
    $.each(confirms, function (i, confirm) {
      $.on(confirm, 'click', function () {
        $.pluginEvent('confirm', 'dialog', _this, _this.dialog);
        if (_this.options.closeOnConfirm) {
          _this.close();
        }
      });
    });

    // 绑定关闭按钮事件
    var closes = $.queryAll('[mdui-dialog-close]', _this.dialog);
    $.each(closes, function (i, close) {
      $.on(close, 'click', function () {
        _this.close();
      });
    });
  }

  /**
   * 打开指定对话框
   * @private
   */
  Dialog.prototype._doOpen = function () {
    var _this = this;

    current = _this;

    if (!isLockScreen) {
      mdui.lockScreen();
      isLockScreen = true;
    }

    _this.dialog.style.display = 'block';

    readjust();
    $.on(window, 'resize', mdui.throttle(function () {
      readjust();
    }, 100));

    // 打开消息框
    _this.dialog.classList.add('mdui-dialog-open');
    _this.state = 'opening';
    $.pluginEvent('open', 'dialog', _this, _this.dialog);

    // 打开对话框动画完成后
    $.transitionEnd(_this.dialog, function () {
      if (_this.dialog.classList.contains('mdui-dialog-open')) {
        _this.state = 'opened';
        $.pluginEvent('opened', 'dialog', _this, _this.dialog);
      }
    });

    // 不存在遮罩层元素时，添加遮罩层
    if (!overlay) {
      overlay = mdui.showOverlay(5100);
    }

    // 点击遮罩层时是否关闭对话框
    $[_this.options.modal ? 'off' : 'on'](overlay, 'click', overlayClick);

    // 是否显示遮罩层，不显示时，把遮罩层背景透明
    overlay.style.opacity = _this.options.overlay ? '' : 0;

    if (_this.options.history) {
      // 如果 hash 中原来就有 &mdui-dialog，先删除，避免后退历史纪录后仍然有 &mdui-dialog 导致无法关闭
      var hash = location.hash.substring(1);
      if (hash.indexOf('&mdui-dialog') > -1) {
        hash = hash.replace(/&mdui-dialog/g, '');
      }

      // 后退按钮关闭对话框
      location.hash = hash + '&mdui-dialog';
      $.on(window, 'hashchange', hashchangeEvent);
    }
  };

  /**
   * 打开对话框
   */
  Dialog.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    // 如果当前有正在打开或已经打开的对话框,或队列不为空，则先加入队列，等旧对话框开始关闭时再打开
    if (
      (current && (current.state === 'opening' || current.state === 'opened')) ||
      $.queue(queueName).length
    ) {
      $.queue(queueName, function () {
        _this._doOpen();
      });

      return;
    }

    _this._doOpen();
  };

  /**
   * 关闭对话框
   */
  Dialog.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    current = null;
    _this.dialog.classList.remove('mdui-dialog-open');
    _this.state = 'closing';
    $.pluginEvent('close', 'dialog', _this, _this.dialog);

    // 所有对话框都关闭，且当前没有打开的对话框时，隐藏遮罩
    if ($.queue(queueName).length === 0 && overlay) {
      mdui.hideOverlay();
      overlay = null;
    }

    $.transitionEnd(_this.dialog, function () {
      if (!_this.dialog.classList.contains('mdui-dialog-open')) {

        _this.state = 'closed';
        $.pluginEvent('closed', 'dialog', _this, _this.dialog);

        _this.dialog.style.display = 'none';

        // 所有对话框都关闭，且当前没有打开的对话框时，解锁屏幕
        if ($.queue(queueName).length === 0 && !current && isLockScreen) {
          mdui.unlockScreen();
          isLockScreen = false;
        }

        $.off(window, 'resize', readjust);

        if (_this.options.destroyOnClosed) {
          _this.destroy();
        }
      }
    });

    if (_this.options.history && $.queue(queueName).length === 0) {
      // 是否需要后退历史纪录，默认为 false。
      // 为 false 时是通过 js 关闭，需要后退一个历史记录
      // 为 true 时是通过后退按钮关闭，不需要后退历史记录
      if (!arguments[0]) {
        window.history.back();
      }

      $.off(window, 'hashchange', hashchangeEvent);
    }

    // 关闭旧对话框，打开新对话框。
    // 加一点延迟，仅仅为了视觉效果更好。不加延时也不影响功能
    setTimeout(function () {
      $.dequeue(queueName);
    }, 100);
  };

  /**
   * 切换对话框打开/关闭状态
   */
  Dialog.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 获取对话框状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Dialog.prototype.getState = function () {
    return this.state;
  };

  /**
   * 销毁对话框
   */
  Dialog.prototype.destroy = function () {
    var _this = this;

    if (_this.append) {
      $.remove(_this.dialog);
    }

    $.data(_this.dialog, 'mdui.dialog', null);

    if ($.queue(queueName).length === 0 && !current) {
      if (overlay) {
        mdui.hideOverlay();
        overlay = null;
      }

      if (isLockScreen) {
        mdui.unlockScreen();
        isLockScreen = false;
      }
    }
  };

  /**
   * 对话框内容变化时，需要调用该方法来调整对话框位置和滚动条高度
   */
  Dialog.prototype.handleUpdate = function () {
    readjust();
  };

  // esc 按下时关闭对话框
  $.on(document, 'keydown', function (e) {
    if (current && current.options.closeOnEsc && current.state === 'opened' && e.keyCode === 27) {
      current.close();
    }
  });

  return Dialog;

})();

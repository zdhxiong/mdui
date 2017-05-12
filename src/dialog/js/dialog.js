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
    overlay: true,                // 打开对话框时是否显示遮罩
    modal: false,                 // 是否模态化对话框，为 false 时点击对话框外面区域关闭对话框，为 true 时不关闭
    closeOnEsc: true,             // 按下 esc 关闭对话框
    closeOnCancel: true,          // 按下取消按钮时关闭对话框
    closeOnConfirm: true,         // 按下确认按钮时关闭对话框
    destroyOnClosed: false,        // 关闭后销毁
  };

  /**
   * 遮罩层元素
   */
  var $overlay;

  /**
   * 窗口是否已锁定
   */
  var isLockScreen;

  /**
   * 当前对话框实例
   */
  var currentInst;

  /**
   * 队列名
   * @type {string}
   */
  var queueName = '__md_dialog';

  /**
   * 窗口宽度变化，或对话框内容变化时，调整对话框位置和对话框内的滚动条
   */
  var readjust = function () {
    if (!currentInst) {
      return;
    }

    var $dialog = currentInst.$dialog;

    var $dialogTitle = $dialog.children('.mdui-dialog-title');
    var $dialogContent = $dialog.children('.mdui-dialog-content');
    var $dialogActions = $dialog.children('.mdui-dialog-actions');

    // 调整 dialog 的 top 和 height 值
    $dialog.height('');
    $dialogContent.height('');

    var dialogHeight = $dialog.height();
    $dialog.css({
      top: (($window.height() - dialogHeight) / 2) + 'px',
      height: dialogHeight + 'px',
    });

    // 调整 mdui-dialog-content 的高度
    $dialogContent.height(
      dialogHeight -
      ($dialogTitle.height() || 0) -
      ($dialogActions.height() || 0)
    );
  };

  /**
   * hashchange 事件触发时关闭对话框
   */
  var hashchangeEvent = function () {
    if (location.hash.substring(1).indexOf('&mdui-dialog') < 0) {
      currentInst.close(true);
    }
  };

  /**
   * 点击遮罩层关闭对话框
   * @param e
   */
  var overlayClick = function (e) {
    if ($(e.target).hasClass('mdui-overlay') && currentInst) {
      currentInst.close();
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
    _this.$dialog = $(selector).eq(0);
    if (!_this.$dialog.length) {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = _this.$dialog.data('mdui.dialog');
    if (oldInst) {
      return oldInst;
    }

    // 如果对话框元素没有在当前文档中，则需要添加
    if (!$.contains(document.body, _this.$dialog[0])) {
      _this.append = true;
      $('body').append(_this.$dialog);
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 绑定取消按钮事件
    _this.$dialog.find('[mdui-dialog-cancel]').each(function () {
      $(this).on('click', function () {
        componentEvent('cancel', 'dialog', _this, _this.$dialog);
        if (_this.options.closeOnCancel) {
          _this.close();
        }
      });
    });

    // 绑定确认按钮事件
    _this.$dialog.find('[mdui-dialog-confirm]').each(function () {
      $(this).on('click', function () {
        componentEvent('confirm', 'dialog', _this, _this.$dialog);
        if (_this.options.closeOnConfirm) {
          _this.close();
        }
      });
    });

    // 绑定关闭按钮事件
    _this.$dialog.find('[mdui-dialog-close]').each(function () {
      $(this).on('click', function () {
        _this.close();
      });
    });
  }

  /**
   * 动画结束回调
   * @param inst
   */
  var transitionEnd = function (inst) {
    if (inst.$dialog.hasClass('mdui-dialog-open')) {
      inst.state = 'opened';
      componentEvent('opened', 'dialog', inst, inst.$dialog);
    } else {
      inst.state = 'closed';
      componentEvent('closed', 'dialog', inst, inst.$dialog);

      inst.$dialog.hide();

      // 所有对话框都关闭，且当前没有打开的对话框时，解锁屏幕
      if (queue.queue(queueName).length === 0 && !currentInst && isLockScreen) {
        $.unlockScreen();
        isLockScreen = false;
      }

      $window.off('resize', $.throttle(function () {
        readjust();
      }, 100));

      if (inst.options.destroyOnClosed) {
        inst.destroy();
      }
    }
  };

  /**
   * 打开指定对话框
   * @private
   */
  Dialog.prototype._doOpen = function () {
    var _this = this;

    currentInst = _this;

    if (!isLockScreen) {
      $.lockScreen();
      isLockScreen = true;
    }

    _this.$dialog.show();

    readjust();
    $window.on('resize', $.throttle(function () {
      readjust();
    }, 100));

    // 打开消息框
    _this.state = 'opening';
    componentEvent('open', 'dialog', _this, _this.$dialog);

    _this.$dialog
      .addClass('mdui-dialog-open')
      .transitionEnd(function () {
        transitionEnd(_this);
      });

    // 不存在遮罩层元素时，添加遮罩层
    if (!$overlay) {
      $overlay = $.showOverlay(5100);
    }

    $overlay

      // 点击遮罩层时是否关闭对话框
      [_this.options.modal ? 'off' : 'on']('click', overlayClick)

      // 是否显示遮罩层，不显示时，把遮罩层背景透明
      .css('opacity', _this.options.overlay ? '' : 0);

    if (_this.options.history) {
      // 如果 hash 中原来就有 &mdui-dialog，先删除，避免后退历史纪录后仍然有 &mdui-dialog 导致无法关闭
      var hash = location.hash.substring(1);
      if (hash.indexOf('&mdui-dialog') > -1) {
        hash = hash.replace(/&mdui-dialog/g, '');
      }

      // 后退按钮关闭对话框
      location.hash = hash + '&mdui-dialog';
      $window.on('hashchange', hashchangeEvent);
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
      (currentInst && (currentInst.state === 'opening' || currentInst.state === 'opened')) ||
      queue.queue(queueName).length
    ) {
      queue.queue(queueName, function () {
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

    // setTimeout 的作用是：
    // 当同时关闭一个对话框，并打开另一个对话框时，使打开对话框的操作先执行，以使需要打开的对话框先加入队列
    setTimeout(function () {
      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      currentInst = null;

      _this.state = 'closing';
      componentEvent('close', 'dialog', _this, _this.$dialog);

      // 所有对话框都关闭，且当前没有打开的对话框时，隐藏遮罩
      if (queue.queue(queueName).length === 0 && $overlay) {
        $.hideOverlay();
        $overlay = null;
      }

      _this.$dialog
        .removeClass('mdui-dialog-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });

      if (_this.options.history && queue.queue(queueName).length === 0) {
        // 是否需要后退历史纪录，默认为 false。
        // 为 false 时是通过 js 关闭，需要后退一个历史记录
        // 为 true 时是通过后退按钮关闭，不需要后退历史记录
        if (!arguments[0]) {
          window.history.back();
        }

        $window.off('hashchange', hashchangeEvent);
      }

      // 关闭旧对话框，打开新对话框。
      // 加一点延迟，仅仅为了视觉效果更好。不加延时也不影响功能
      setTimeout(function () {
        queue.dequeue(queueName);
      }, 100);
    }, 0);
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
      _this.$dialog.remove();
    }

    _this.$dialog.removeData('mdui.dialog');

    if (queue.queue(queueName).length === 0 && !currentInst) {
      if ($overlay) {
        $.hideOverlay();
        $overlay = null;
      }

      if (isLockScreen) {
        $.unlockScreen();
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
  $document.on('keydown', function (e) {
    if (
      currentInst &&
      currentInst.options.closeOnEsc &&
      currentInst.state === 'opened' &&
      e.keyCode === 27
    ) {
      currentInst.close();
    }
  });

  return Dialog;

})();

/**
 * =============================================================================
 * ************   ToolTip 工具提示   ************
 * =============================================================================
 */

mdui.Tooltip = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    position: 'auto',     // 提示所在位置
    delay: 0,             // 延迟，单位毫秒
    content: '',          // 提示文本，允许包含 HTML
  };

  /**
   * 是否是桌面设备
   * @returns {boolean}
   */
  var isDesktop = function () {
    return $window.width() > 1024;
  };

  /**
   * 设置 Tooltip 的位置
   * @param inst
   */
  function setPosition(inst) {
    var marginLeft;
    var marginTop;
    var position;

    // 触发的元素
    var targetProps = inst.$target[0].getBoundingClientRect();

    // 触发的元素和 Tooltip 之间的距离
    var targetMargin = (isDesktop() ? 14 : 24);

    // Tooltip 的宽度和高度
    var tooltipWidth = inst.$tooltip[0].offsetWidth;
    var tooltipHeight = inst.$tooltip[0].offsetHeight;

    // Tooltip 的方向
    position = inst.options.position;

    // 自动判断位置，加 2px，使 Tooltip 距离窗口边框至少有 2px 的间距
    if (['bottom', 'top', 'left', 'right'].indexOf(position) === -1) {
      if (
        targetProps.top + targetProps.height + targetMargin + tooltipHeight + 2 <
        $window.height()
      ) {
        position = 'bottom';
      } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
        position = 'top';
      } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
        position = 'left';
      } else if (
        targetProps.width + targetMargin + tooltipWidth + 2 <
        $window.width() - targetProps.left
      ) {
        position = 'right';
      } else {
        position = 'bottom';
      }
    }

    // 设置位置
    switch (position) {
      case 'bottom':
        marginLeft = -1 * (tooltipWidth / 2);
        marginTop = (targetProps.height / 2) + targetMargin;
        inst.$tooltip.transformOrigin('top center');
        break;
      case 'top':
        marginLeft = -1 * (tooltipWidth / 2);
        marginTop = -1 * (tooltipHeight + (targetProps.height / 2) + targetMargin);
        inst.$tooltip.transformOrigin('bottom center');
        break;
      case 'left':
        marginLeft = -1 * (tooltipWidth + (targetProps.width / 2) + targetMargin);
        marginTop = -1 * (tooltipHeight / 2);
        inst.$tooltip.transformOrigin('center right');
        break;
      case 'right':
        marginLeft = (targetProps.width / 2) + targetMargin;
        marginTop = -1 * (tooltipHeight / 2);
        inst.$tooltip.transformOrigin('center left');
        break;
    }

    var targetOffset = inst.$target.offset();
    inst.$tooltip.css({
      top: targetOffset.top + (targetProps.height / 2) + 'px',
      left: targetOffset.left + (targetProps.width / 2) + 'px',
      'margin-left': marginLeft + 'px',
      'margin-top': marginTop + 'px',
    });
  }

  /**
   * Tooltip 实例
   * @param selector
   * @param opts
   * @constructor
   */
  function Tooltip(selector, opts) {
    var _this = this;

    _this.$target = $(selector).eq(0);
    if (!_this.$target.length) {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = _this.$target.data('mdui.tooltip');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 创建 Tooltip HTML
    var guid = $.guid('tooltip');
    _this.$tooltip = $(
      '<div class="mdui-tooltip" id="mdui-tooltip-' + guid + '">' +
        _this.options.content +
      '</div>'
    ).appendTo(document.body);

    // 绑定事件
    _this.$target
      .on('touchstart mouseenter', function (e) {
        if (!TouchHandler.isAllow(e)) {
          return;
        }

        TouchHandler.register(e);

        _this.open();
      })
      .on('touchend mouseleave', function (e) {
        if (!TouchHandler.isAllow(e)) {
          return;
        }

        _this.close();
      })
      .on(TouchHandler.unlock, TouchHandler.register);
  }

  /**
   * 动画结束回调
   * @private
   */
  var transitionEnd = function (inst) {
    if (inst.$tooltip.hasClass('mdui-tooltip-open')) {
      inst.state = 'opened';
      componentEvent('opened', 'tooltip', inst, inst.$target);
    } else {
      inst.state = 'closed';
      componentEvent('closed', 'tooltip', inst, inst.$target);
    }
  };

  /**
   * 执行打开 Tooltip
   * @private
   */
  Tooltip.prototype._doOpen = function () {
    var _this = this;

    _this.state = 'opening';
    componentEvent('open', 'tooltip', _this, _this.$target);

    _this.$tooltip
      .addClass('mdui-tooltip-open')
      .transitionEnd(function () {
        transitionEnd(_this);
      });
  };

  /**
   * 打开 Tooltip
   * @param opts 允许每次打开时设置不同的参数
   */
  Tooltip.prototype.open = function (opts) {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    var oldOpts = _this.options;

    // 合并 data 属性参数
    $.extend(_this.options, parseOptions(_this.$target.attr('mdui-tooltip')));
    if (opts) {
      $.extend(_this.options, opts);
    }

    // tooltip 的内容有更新
    if (oldOpts.content !== _this.options.content) {
      _this.$tooltip.html(_this.options.content);
    }

    setPosition(_this);

    if (_this.options.delay) {
      _this.timeoutId = setTimeout(function () {
        _this._doOpen();
      }, _this.options.delay);
    } else {
      _this.timeoutId = false;
      _this._doOpen();
    }
  };

  /**
   * 关闭 Tooltip
   */
  Tooltip.prototype.close = function () {
    var _this = this;

    if (_this.timeoutId) {
      clearTimeout(_this.timeoutId);
      _this.timeoutId = false;
    }

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    _this.state = 'closing';
    componentEvent('close', 'tooltip', _this, _this.$target);

    _this.$tooltip
      .removeClass('mdui-tooltip-open')
      .transitionEnd(function () {
        transitionEnd(_this);
      });
  };

  /**
   * 切换 Tooltip 状态
   */
  Tooltip.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 获取 Tooltip 状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Tooltip.prototype.getState = function () {
    return this.state;
  };

  /**
   * 销毁 Tooltip
   */
  /*Tooltip.prototype.destroy = function () {
    var _this = this;
    clearTimeout(_this.timeoutId);
    $.data(_this.target, 'mdui.tooltip', null);
    $.remove(_this.tooltip);
  };*/

  return Tooltip;

})();

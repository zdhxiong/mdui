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
   * 设置 Tooltip 的位置
   * @param inst
   */
  function setPosition(inst) {
    var marginLeft;
    var marginTop;
    var position;

    // 触发的元素
    var targetProps = inst.target.getBoundingClientRect();

    // 触发的元素和 Tooltip 之间的距离
    var targetMargin = (mdui.support.touch ? 24 : 14);

    // Tooltip 的宽度和高度
    var tooltipWidth = inst.tooltip.offsetWidth;
    var tooltipHeight = inst.tooltip.offsetHeight;

    // Tooltip 的方向
    position = inst.options.position;

    // 自动判断位置，加 2px，使 Tooltip 距离窗口边框至少有 2px 的间距
    if (['bottom', 'top', 'left', 'right'].indexOf(position) === -1) {
      if (
        targetProps.top + targetProps.height + targetMargin + tooltipHeight + 2 <
        document.documentElement.clientHeight
      ) {
        position = 'bottom';
      } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
        position = 'top';
      } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
        position = 'left';
      } else if (
        targetProps.width + targetMargin + tooltipWidth + 2 <
        document.documentElement.clientWidth - targetProps.left
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
        $.transformOrigin(inst.tooltip, 'top center');
        break;
      case 'top':
        marginLeft = -1 * (tooltipWidth / 2);
        marginTop = -1 * (tooltipHeight + (targetProps.height / 2) + targetMargin);
        $.transformOrigin(inst.tooltip, 'bottom center');
        break;
      case 'left':
        marginLeft = -1 * (tooltipWidth + (targetProps.width / 2) + targetMargin);
        marginTop = -1 * (tooltipHeight / 2);
        $.transformOrigin(inst.tooltip, 'center right');
        break;
      case 'right':
        marginLeft = (targetProps.width / 2) + targetMargin;
        marginTop = -1 * (tooltipHeight / 2);
        $.transformOrigin(inst.tooltip, 'center left');
        break;
    }

    var targetOffset = $.offset(inst.target);
    inst.tooltip.style.top = targetOffset.top + (targetProps.height / 2) + 'px';
    inst.tooltip.style.left = targetOffset.left + (targetProps.width / 2) + 'px';
    inst.tooltip.style['margin-left'] = marginLeft + 'px';
    inst.tooltip.style['margin-top'] = marginTop + 'px';
  }

  /**
   * Tooltip 实例
   * @param selector
   * @param opts
   * @constructor
   */
  function Tooltip(selector, opts) {
    var _this = this;

    _this.target = $.dom(selector)[0];
    if (typeof _this.target === 'undefined') {
      return;
    }

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.data(_this.target, 'mdui.tooltip');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 创建 Tooltip HTML
    var guid = mdui.guid();
    _this.tooltip = $.dom(
      '<div class="mdui-tooltip ' +
        (mdui.support.touch ? 'mdui-tooltip-mobile' : 'mdui-tooltip-desktop') +
        '" id="mdui-tooltip-' + guid + '">' +
        _this.options.content + '</div>'
    )[0];
    document.body.appendChild(_this.tooltip);

    // 绑定事件
    var openEvent = mdui.support.touch ? 'touchstart' : 'mouseenter';
    var closeEvent = mdui.support.touch ? 'touchend' : 'mouseleave';
    $.on(_this.target, openEvent, function () {
      _this.open();
    });

    $.on(_this.target, closeEvent, function () {
      _this.close();
    });
  }

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
    var dataOpts = $.parseOptions(_this.target.getAttribute('mdui-tooltip'));
    _this.options = $.extend(_this.options, dataOpts);

    if (opts) {
      _this.options = $.extend(_this.options, opts);
    }

    if (oldOpts.content !== _this.options.content) {
      _this.tooltip.innerHTML = _this.options.content;
    }

    setPosition(_this);

    _this.timeoutId = setTimeout(function () {
      _this.tooltip.classList.add('mdui-tooltip-open');
      _this.state = 'opening';
      $.pluginEvent('open', 'tooltip', _this, _this.target);

      $.transitionEnd(_this.tooltip, function () {
        if (_this.tooltip.classList.contains('mdui-tooltip-open')) {
          _this.state = 'opened';
          $.pluginEvent('opened', 'tooltip', _this, _this.target);
        }
      });
    }, _this.options.delay);
  };

  /**
   * 关闭 Tooltip
   */
  Tooltip.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    clearTimeout(_this.timeoutId);
    _this.tooltip.classList.remove('mdui-tooltip-open');
    _this.state = 'closing';
    $.pluginEvent('close', 'tooltip', _this, _this.target);

    $.transitionEnd(_this.tooltip, function () {
      if (!_this.tooltip.classList.contains('mdui-tooltip-open')) {
        _this.state = 'closed';
        $.pluginEvent('closed', 'tooltip', _this, _this.target);
      }
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

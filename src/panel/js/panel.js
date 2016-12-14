/**
 * =============================================================================
 * ************   Expansion panel 可扩展面板   ************
 * =============================================================================
 */

mdui.Panel = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    accordion: false,      // 是否使用手风琴效果，打开一个项目时，自动关闭其他项目
  };

  /**
   * 可扩展面板
   * @param selector
   * @param opts
   * @returns {*}
   * @constructor
   */
  function Panel(selector, opts) {
    var _this = this;

    // 可扩展面板元素
    _this.panel = $.dom(selector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.panel, 'mdui.panel');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    $.on(_this.panel, 'click', '.mdui-panel-item-header', function () {
      var item = $.parent(this, '.mdui-panel-item');
      _this.toggle(item);
    });
  }

  /**
   * 指定 item 是否处于打开状态
   * @param item
   * @returns {boolean}
   * @private
   */
  var _isOpen = function (item) {
    return item.classList.contains('mdui-panel-item-open');
  };

  /**
   * 获取指定 item
   * @param item
   * @returns {*}
   * @private
   */
  Panel.prototype._getItem = function (item) {
    var _this = this;

    if (parseInt(item) === item) {
      var items = $.children(_this.panel, '.mdui-panel-item');
      return items[item];
    }

    return $.dom(item)[0];
  };

  /**
   * 打开指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Panel.prototype.open = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_isOpen(item)) {
      return;
    }

    var content = $.child(item, '.mdui-panel-item-body');
    var contentHeight = content.scrollHeight;

    $.pluginEvent('open', 'panel', _this, item);

    item.classList.add('mdui-panel-item-open');
    content.style.height = contentHeight + 'px';

    // 动画结束后重新设置高度。打开后设置为自动高度。有可能计算的高度不正确，让浏览器自动调整
    $.transitionEnd(item, function () {
      if (_isOpen(item)) {
        content.style.height = 'auto';
        $.pluginEvent('opened', 'panel', _this, item);
      }
    });

    // 关闭其他项
    if (_this.options.accordion) {
      $.each($.children(_this.panel, '.mdui-panel-item-open'), function (i, temp) {
        if (temp !== item) {
          _this.close(temp);
        }
      });
    }
  };

  /**
   * 关闭指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Panel.prototype.close = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (!_isOpen(item)) {
      return;
    }

    var content = $.child(item, '.mdui-panel-item-body');
    var contentHeight = parseFloat($.getStyle(content, 'height'));
    content.style.height = contentHeight + 'px';
    $.getStyle(content, 'height');

    $.pluginEvent('close', 'panel', _this, item);

    item.classList.remove('mdui-panel-item-open');
    content.style.height = 0;

    $.transitionEnd(item, function () {
      if (!_isOpen(item)) {
        $.pluginEvent('closed', 'panel', _this, item);
      }
    });
  };

  /**
   * 切换指定项的状态
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Panel.prototype.toggle = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_isOpen(item)) {
      _this.close(item);
    } else {
      _this.open(item);
    }
  };

  /**
   * 打开所有项
   */
  Panel.prototype.openAll = function () {
    var _this = this;

    $.each($.children(_this.panel, '.mdui-panel-item'), function (i, item) {
      if (!_isOpen(item)) {
        _this.open(item);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Panel.prototype.closeAll = function () {
    var _this = this;

    $.each($.children(_this.panel, '.mdui-panel-item'), function (i, item) {
      if (_isOpen(item)) {
        _this.close(item);
      }
    });
  };

  return Panel;

})();

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
    accordion: false,      // 是否使用手风情效果，打开一个项目时，自动关闭其他项目
  };

  var itemHeight = 48;
  var headerHeight = 64;

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
    _this.items = $.children(_this.panel, '.mdui-panel-item');
    _this.headers = [];
    _this.contents = [];

    $.each(_this.items, function (i, item) {
      _this.headers[i] = $.child(item, '.mdui-panel-item-header');
      _this.contents[i] = $.child(item, '.mdui-panel-item-body');

      // 绑定触发事件
      $.on(_this.headers[i], 'click', function () {
        _this.toggle(i);
      });
    });
  }

  /**
   * 打开指定项
   * @param index 面板项的索引号或 DOM 元素
   */
  Panel.prototype.open = function (index) {
    var _this = this;
    var contentHeight;
    var item;

    if (parseInt(index) === index) {
      item = _this.items[index];
    } else {
      $.each(_this.items, function (i, temp) {
        if (index === temp) {
          item = temp;
          index = i;
          return false;
        }
      });
    }

    var content = _this.contents[index];

    // 计算元素的高度
    contentHeight = content ? parseFloat($.getStyle(content, 'height')) : 0;

    $.pluginEvent('open', 'panel', _this, item);

    item.classList.add('mdui-panel-item-open');

    // 设置 item 的高度，header + content
    item.style.height = headerHeight + contentHeight + 'px';

    // 动画结束后重新设置高度。打开后设置为自动高度。有可能计算的高度不正确，让浏览器自动调整
    $.transitionEnd(item, function () {
      if (item.classList.contains('mdui-panel-item-open')) {
        item.style.height = 'auto';

        $.pluginEvent('opened', 'panel', _this, item);
      }
    });

    // 关闭其他项
    if (_this.options.accordion) {
      $.each(_this.items, function (i, item) {
        if (i !== index && item.classList.contains('mdui-panel-item-open')) {
          _this.close(i);
        }
      });
    }
  };

  /**
   * 关闭指定项
   * @param index
   */
  Panel.prototype.close = function (index) {
    var _this = this;
    var item;

    if (parseInt(index) === index) {
      item = _this.items[index];
    } else {
      $.each(_this.items, function (i, temp) {
        if (index === temp) {
          item = temp;
          index = i;
          return false;
        }
      });
    }

    // 设置打开状态的 item 的高度
    item.style.height = $.getStyle(item, 'height');
    $.getStyle(item, 'height');

    $.pluginEvent('close', 'panel', _this, item);

    item.classList.remove('mdui-panel-item-open');

    item.style.height = itemHeight + 'px';

    $.transitionEnd(item, function () {
      $.pluginEvent('closed', 'panel', _this, item);
    });
  };

  /**
   * 切换指定项的状态
   * @param index
   */
  Panel.prototype.toggle = function (index) {
    var _this = this;
    var item;

    if (parseInt(index) === index) {
      item = _this.items[index];
    } else {
      $.each(_this.items, function (i, temp) {
        if (index === temp) {
          item = temp;
          index = i;
          return false;
        }
      });
    }

    if (item.classList.contains('mdui-panel-item-open')) {
      _this.close(index);
    } else {
      _this.open(index);
    }
  };

  /**
   * 打开所有项
   */
  Panel.prototype.openAll = function () {
    var _this = this;

    $.each(_this.items, function (i, item) {
      if (!item.classList.contains('mdui-panel-item-open')) {
        _this.open(i);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Panel.prototype.closeAll = function () {
    var _this = this;

    $.each(_this.items, function (i, item) {
      if (item.classList.contains('mdui-panel-item-open')) {
        _this.close(i);
      }
    });
  };

  return Panel;

})();

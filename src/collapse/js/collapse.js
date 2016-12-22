/**
 * =============================================================================
 * ************   供 Collapse、 Panel 调用的折叠内容块插件   ************
 * =============================================================================
 */
$.Collapse = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    accordion: false,                             // 是否使用手风琴效果
  };

  // 类名
  var CLASS = {
    item: 'mdui-collapse-item',           // item 类名
    itemOpen: 'mdui-collapse-item-open',  // 打开状态的 item
    header: 'mdui-collapse-item-header',  // item 中的 header 类名
    body: 'mdui-collapse-item-body',      // item 中的 body 类名
  };

  // 命名空间
  var NAMESPACE = 'collapse';

  /**
   * 折叠内容块
   * @param selector
   * @param opts
   * @param classes
   * @param namespace
   * @constructor
   */
  function Collapse(selector, opts, classes, namespace) {
    var _this = this;

    _this.classes = $.extend(CLASS, classes || {});
    _this.namespace = (typeof namespace === 'undefined' || !namespace) ? NAMESPACE : namespace;

    // 折叠面板元素
    _this.collapse = $.dom(selector)[0];
    if (typeof _this.collapse === 'undefined') {
      return;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.collapse, 'mdui.' + _this.namespace);
    if (oldInst) {
      return oldInst;
    }

    $.on(_this.collapse, 'click', '.' + _this.classes.header, function (e) {
      var item = $.parent(this, '.' + _this.classes.item);
      if ($.child(_this.collapse, item)) {
        _this.toggle(item);
      }
    });
  }

  /**
   * 指定 item 是否处于打开状态
   * @param item
   * @returns {boolean}
   * @private
   */
  Collapse.prototype._isOpen = function (item) {
    return item.classList.contains(this.classes.itemOpen);
  };

  /**
   * 获取指定 item
   * @param item
   * @returns {*}
   * @private
   */
  Collapse.prototype._getItem = function (item) {
    var _this = this;

    if (parseInt(item) === item) {
      var items = $.children(_this.collapse, '.' + _this.classes.item);
      return items[item];
    }

    return $.dom(item)[0];
  };

  /**
   * 打开指定面板项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapse.prototype.open = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_this._isOpen(item)) {
      return;
    }

    // 关闭其他项
    if (_this.options.accordion) {
      $.each($.children(_this.collapse, '.' + _this.classes.itemOpen), function (i, temp) {
        if (temp !== item) {
          _this.close(temp);
        }
      });
    }

    var content = $.child(item, '.' + _this.classes.body);
    content.style.height = content.scrollHeight + 'px';

    $.transitionEnd(content, function () {
      if (_this._isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
        $.pluginEvent('opened', _this.namespace, _this, item);
      } else {
        content.style.height = '';
      }
    });

    $.pluginEvent('open', _this.namespace, _this, item);
    item.classList.add(_this.classes.itemOpen);
  };

  /**
   * 关闭指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapse.prototype.close = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (!_this._isOpen(item)) {
      return;
    }

    var content = $.child(item, '.' + _this.classes.body);
    item.classList.remove(_this.classes.itemOpen);
    $.transition(content, 0);
    content.style.height = content.scrollHeight + 'px';
    $.relayout(content);

    $.transition(content, '');
    content.style.height = '';
    $.pluginEvent('close', _this.namespace, _this, item);

    $.transitionEnd(content, function () {
      if (_this._isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
      } else {
        content.style.height = '';
        $.pluginEvent('closed', _this.namespace, _this, item);
      }
    });
  };

  /**
   * 切换指定项的状态
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapse.prototype.toggle = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_this._isOpen(item)) {
      _this.close(item);
    } else {
      _this.open(item);
    }
  };

  /**
   * 打开所有项
   */
  Collapse.prototype.openAll = function () {
    var _this = this;

    $.each($.children(_this.collapse, '.' + _this.classes.item), function (i, item) {
      if (!_this._isOpen(item)) {
        _this.open(item);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Collapse.prototype.closeAll = function () {
    var _this = this;

    $.each($.children(_this.collapse, '.' + _this.classes.item), function (i, item) {
      if (_this._isOpen(item)) {
        _this.close(item);
      }
    });
  };

  return Collapse;
})();

/**
 * =============================================================================
 * ************   Collapse 折叠内容块插件   ************
 * =============================================================================
 */
mdui.Collapse = (function () {

  function Collapse(selector, opts) {
    return new $.Collapse(selector, opts);
  }

  return Collapse;
})();

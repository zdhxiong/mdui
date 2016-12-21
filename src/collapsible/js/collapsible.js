/**
 * =============================================================================
 * ************   供 Collapsible、 Panel、 Sublist 调用的折叠插件   ************
 * =============================================================================
 */
$.Collapsible = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    accordion: false,                             // 是否使用手风琴效果
    itemClass: 'mdui-collapsible-item',           // item 类名
    itemOpenClass: 'mdui-collapsible-item-open',  // 打开状态的 item
    headerClass: 'mdui-collapsible-item-header',  // item 中的 header 类名
    bodyClass: 'mdui-collapsible-item-body',      // item 中的 body 类名
    namespace: 'collapsible',                     // 命名空间
  };

  /**
   * 折叠面板
   * @param selector
   * @param opts
   * @constructor
   */
  function Collapsible(selector, opts) {
    var _this = this;

    // 折叠面板元素
    _this.collapsible = $.dom(selector)[0];
    if (typeof _this.collapsible === 'undefined') {
      return;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.collapsible, 'mdui.' + _this.options.collapsible);
    if (oldInst) {
      return oldInst;
    }

    $.on(_this.collapsible, 'click', '.' + _this.options.headerClass, function () {
      var item = $.parent(this, '.' + _this.options.itemClass);
      _this.toggle(item);
    });
  }

  /**
   * 指定 item 是否处于打开状态
   * @param item
   * @returns {boolean}
   * @private
   */
  Collapsible.prototype._isOpen = function (item) {
    var _this = this;
    return item.classList.contains(_this.options.itemOpenClass);
  };

  /**
   * 获取指定 item
   * @param item
   * @returns {*}
   * @private
   */
  Collapsible.prototype._getItem = function (item) {
    var _this = this;

    if (parseInt(item) === item) {
      var items = $.children(_this.collapsible, '.' + _this.options.itemClass);
      return items[item];
    }

    return $.dom(item)[0];
  };

  /**
   * 打开指定面板项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapsible.prototype.open = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_this._isOpen(item)) {
      return;
    }

    // 关闭其他项
    if (_this.options.accordion) {
      $.each($.children(_this.collapsible, '.' + _this.options.itemOpenClass), function (i, temp) {
        if (temp !== item) {
          _this.close(temp);
        }
      });
    }

    var content = $.child(item, '.' + _this.options.bodyClass);
    content.style.height = content.scrollHeight + 'px';

    $.transitionEnd(content, function () {
      if (_this._isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
        $.pluginEvent('opened', _this.options.namespace, _this, item);
      } else {
        content.style.height = '';
      }
    });

    $.pluginEvent('open', _this.options.namespace, _this, item);
    item.classList.add(_this.options.itemOpenClass);
  };

  /**
   * 关闭指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapsible.prototype.close = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (!_this._isOpen(item)) {
      return;
    }

    var content = $.child(item, '.' + _this.options.bodyClass);
    item.classList.remove(_this.options.itemOpenClass);
    $.transition(content, 0);
    content.style.height = content.scrollHeight + 'px';
    $.relayout(content);

    $.transition(content, '');
    content.style.height = '';
    $.pluginEvent('close', _this.options.namespace, _this, item);

    $.transitionEnd(content, function () {
      if (_this._isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
      } else {
        content.style.height = '';
        $.pluginEvent('closed', _this.options.namespace, _this, item);
      }
    });
  };

  /**
   * 切换指定项的状态
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapsible.prototype.toggle = function (item) {
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
  Collapsible.prototype.openAll = function () {
    var _this = this;

    $.each($.children(_this.collapsible, '.' + _this.options.itemClass), function (i, item) {
      if (!_this._isOpen(item)) {
        _this.open(item);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Collapsible.prototype.closeAll = function () {
    var _this = this;

    $.each($.children(_this.collapsible, '.' + _this.options.itemClass), function (i, item) {
      if (_this._isOpen(item)) {
        _this.close(item);
      }
    });
  };

  return Collapsible;
})();


/**
 * =============================================================================
 * ************   Collapsible 折叠插件   ************
 * =============================================================================
 */
mdui.Collapsible = (function () {

  function Collapsible(selector, opts) {
    new $.Collapsible(selector, opts);
  }

  return Collapsible;
})();

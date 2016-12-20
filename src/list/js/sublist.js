/**
 * =============================================================================
 * ************   Sublist 子列表   ************
 * =============================================================================
 */

mdui.Sublist = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    accordion: false,      // 是否使用手风琴效果，打开一个项目时，自动关闭其他项目
  };

  /**
   * 子列表
   * @param selector
   * @param opts
   * @returns {*}
   * @constructor
   */
  function Sublist(selector, opts) {
    var _this = this;

    // 子列表元素
    _this.sublist = $.dom(selector)[0];
    if (typeof _this.sublist === 'undefined') {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.sublist, 'mdui.sublist');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    $.on(_this.sublist, 'click', '.mdui-list-sub>.mdui-list-item', function () {
      var item = $.parent(this, '.mdui-list-sub');
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
    return item.classList.contains('mdui-list-sub-open');
  };

  /**
   * 获取指定 item
   * @param item
   * @returns {*}
   * @private
   */
  Sublist.prototype._getItem = function (item) {
    var _this = this;

    if (parseInt(item) === item) {
      var items = $.children(_this.sublist, '.mdui-list-sub');
      return items[item];
    }

    return $.dom(item)[0];
  };

  /**
   * 打开指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Sublist.prototype.open = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (_isOpen(item)) {
      return;
    }

    // 关闭其他项
    if (_this.options.accordion) {
      $.each($.children(_this.sublist, '.mdui-list-sub-open'), function (i, temp) {
        if (temp !== item) {
          _this.close(temp);
        }
      });
    }

    var content = $.child(item, '.mdui-list');
    content.style.height = content.scrollHeight + 'px';

    $.transitionEnd(content, function () {
      if (_isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
        $.pluginEvent('opened', 'sublist', _this, item);
      } else {
        content.style.height = '';
      }
    });

    $.pluginEvent('open', 'sublist', _this, item);
    item.classList.add('mdui-list-sub-open');
  };

  /**
   * 关闭指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Sublist.prototype.close = function (item) {
    var _this = this;
    item = _this._getItem(item);

    if (!_isOpen(item)) {
      return;
    }

    var content = $.child(item, '.mdui-list');
    item.classList.remove('mdui-list-sub-open');
    $.transition(content, 0);
    content.style.height = content.scrollHeight + 'px';
    $.relayout(content);

    $.transition(content, '');
    content.style.height = '';
    $.pluginEvent('close', 'sublist', _this, item);

    $.transitionEnd(content, function () {
      if (_isOpen(item)) {
        $.transition(content, 0);
        content.style.height = 'auto';
        $.relayout(content);
        $.transition(content, '');
      } else {
        content.style.height = '';
        $.pluginEvent('closed', 'sublist', _this, item);
      }
    });
  };

  /**
   * 切换指定项的状态
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Sublist.prototype.toggle = function (item) {
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
  Sublist.prototype.openAll = function () {
    var _this = this;

    $.each($.children(_this.sublist, '.mdui-list-sub'), function (i, item) {
      if (!_isOpen(item)) {
        _this.open(item);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Sublist.prototype.closeAll = function () {
    var _this = this;

    $.each($.children(_this.sublist, '.mdui-list-sub'), function (i, item) {
      if (_isOpen(item)) {
        _this.close(item);
      }
    });
  };

  return Sublist;

})();

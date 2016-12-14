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
    accordion: false,     // 是否使用手风琴效果
  };

  /**
   * 子列表
   * @param selector
   * @param opts
   * @constructor
   */
  function Sublist(selector, opts) {
    var _this = this;

    // 列表
    _this.list = $.dom(selector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.list, 'mdui.sublist');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));

    $.on(_this.list, 'click', '.mdui-list-sub>.mdui-list-item', function () {
      var sub = $.parent(this, '.mdui-list-sub');
      _this.toggle(sub);
    });
  }

  /**
   * 子菜单是否处于打开状态
   * @param sub
   * @returns {boolean}
   * @private
   */
  var _isOpen = function (sub) {
    return sub.classList.contains('mdui-list-sub-open');
  };

  /**
   * @param sub
   * @returns {*}
   * @private
   */
  Sublist.prototype._getSub = function (sub) {
    var _this = this;

    if (parseInt(sub) === sub) {
      var subs = $.children(_this.list, '.mdui-list-sub');
      return subs[sub];
    }

    return $.dom(sub)[0];
  };

  /**
   * 打开指定子列表
   * @param sub
   */
  Sublist.prototype.open = function (sub) {
    var _this = this;
    sub = _this._getSub(sub);

    if (_isOpen(sub)) {
      return;
    }

    var subList = $.child(sub, '.mdui-list');
    var subListHeight = subList.scrollHeight;

    $.pluginEvent('open', 'sublist', _this, sub);

    sub.classList.add('mdui-list-sub-open');
    subList.style.height = subListHeight + 'px';

    $.transitionEnd(sub, function () {
      if (_isOpen(sub)) {
        subList.style.height = 'auto';
        $.pluginEvent('opened', 'sublist', _this, sub);
      }
    });

    // 关闭其他项
    if (_this.options.accordion) {
      $.each($.children(_this.list, '.mdui-list-sub-open'), function (i, temp) {
        if (temp !== sub) {
          _this.close(temp);
        }
      });
    }
  };

  /**
   * 关闭指定子列表
   * @param sub
   */
  Sublist.prototype.close = function (sub) {
    var _this = this;
    sub = _this._getSub(sub);

    if (!_isOpen(sub)) {
      return;
    }

    var subList = $.child(sub, '.mdui-list');
    var subListHeight = parseFloat($.getStyle(subList, 'height'));
    subList.style.height = subListHeight + 'px';
    $.getStyle(subList, 'height');

    $.pluginEvent('close', 'sublist', _this, sub);

    sub.classList.remove('mdui-list-sub-open');
    subList.style.height = 0;

    $.transitionEnd(sub, function () {
      if (!_isOpen(sub)) {
        $.pluginEvent('closed', 'sublist', _this, sub);
      }
    });
  };

  /**
   * 切换子列表状态
   * @param sub
   */
  Sublist.prototype.toggle = function (sub) {
    var _this = this;
    sub = _this._getSub(sub);

    if (_isOpen(sub)) {
      _this.close(sub);
    } else {
      _this.open(sub);
    }
  };

  /**
   * 打开所有子列表
   */
  Sublist.prototype.openAll = function () {
    var _this = this;

    $.each($.children(_this.list, '.mdui-list-sub'), function (i, sub) {
      if (!_isOpen(sub)) {
        _this.open(sub);
      }
    });
  };

  /**
   * 关闭所有子列表
   */
  Sublist.prototype.closeAll = function () {
    var _this = this;

    $.each($.children(_this.list, '.mdui-list-sub'), function (i, sub) {
      if (_isOpen(sub)) {
        _this.close(sub);
      }
    });
  };

  return Sublist;

})();

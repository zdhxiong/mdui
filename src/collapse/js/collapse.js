/**
 * =============================================================================
 * ************   供 Collapse、 Panel 调用的折叠内容块插件   ************
 * =============================================================================
 */
var CollapsePrivate = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    accordion: false,                             // 是否使用手风琴效果
  };

  /**
   * 折叠内容块
   * @param selector
   * @param opts
   * @param namespace
   * @constructor
   */
  function Collapse(selector, opts, namespace) {
    var _this = this;

    // 命名空间
    _this.ns = namespace;

    // 类名
    var classpPefix = 'mdui-' + _this.ns + '-item';
    _this.class_item = classpPefix;
    _this.class_item_open = classpPefix + '-open';
    _this.class_header = classpPefix + '-header';
    _this.class_body = classpPefix + '-body';

    // 折叠面板元素
    _this.$collapse = $(selector).eq(0);
    if (!_this.$collapse.length) {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = _this.$collapse.data('mdui.' + _this.ns);
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));

    _this.$collapse.on('click', '.' + _this.class_header, function () {
      var $item = $(this).parent('.' + _this.class_item);
      if (_this.$collapse.children($item).length) {
        _this.toggle($item);
      }
    });

    // 绑定关闭按钮
    _this.$collapse.on('click', '[mdui-' + _this.ns + '-item-close]', function () {
      var $item = $(this).parents('.' + _this.class_item).eq(0);
      if (_this._isOpen($item)) {
        _this.close($item);
      }
    });
  }

  /**
   * 指定 item 是否处于打开状态
   * @param $item
   * @returns {boolean}
   * @private
   */
  Collapse.prototype._isOpen = function ($item) {
    return $item.hasClass(this.class_item_open);
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
      // item 是索引号
      return _this.$collapse.children('.' + _this.class_item).eq(item);
    }

    return $(item).eq(0);
  };

  /**
   * 动画结束回调
   * @param inst
   * @param $content
   * @param $item
   */
  var transitionEnd = function (inst, $content, $item) {
    if (inst._isOpen($item)) {
      $content
        .transition(0)
        .height('auto')
        .reflow()
        .transition('');

      componentEvent('opened', inst.ns, inst, $item[0]);
    } else {
      $content.height('');

      componentEvent('closed', inst.ns, inst, $item[0]);
    }
  };

  /**
   * 打开指定面板项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapse.prototype.open = function (item) {
    var _this = this;
    var $item = _this._getItem(item);

    if (_this._isOpen($item)) {
      return;
    }

    // 关闭其他项
    if (_this.options.accordion) {
      _this.$collapse.children('.' + _this.class_item_open).each(function () {
        var $tmpItem = $(this);

        if ($tmpItem !== $item) {
          _this.close($tmpItem);
        }
      });
    }

    var $content = $item.children('.' + _this.class_body);

    $content
      .height($content[0].scrollHeight)
      .transitionEnd(function () {
        transitionEnd(_this, $content, $item);
      });

    componentEvent('open', _this.ns, _this, $item[0]);

    $item.addClass(_this.class_item_open);
  };

  /**
   * 关闭指定项
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器
   */
  Collapse.prototype.close = function (item) {
    var _this = this;
    var $item = _this._getItem(item);

    if (!_this._isOpen($item)) {
      return;
    }

    var $content = $item.children('.' + _this.class_body);

    componentEvent('close', _this.ns, _this, $item[0]);

    $item.removeClass(_this.class_item_open);

    $content
      .transition(0)
      .height($content[0].scrollHeight)
      .reflow()
      .transition('')
      .height('')
      .transitionEnd(function () {
        transitionEnd(_this, $content, $item);
      });
  };

  /**
   * 切换指定项的状态
   * @param item 面板项的索引号或 DOM 元素或 CSS 选择器或 JQ 对象
   */
  Collapse.prototype.toggle = function (item) {
    var _this = this;
    var $item = _this._getItem(item);

    if (_this._isOpen($item)) {
      _this.close($item);
    } else {
      _this.open($item);
    }
  };

  /**
   * 打开所有项
   */
  Collapse.prototype.openAll = function () {
    var _this = this;

    _this.$collapse.children('.' + _this.class_item).each(function () {
      var $tmpItem = $(this);

      if (!_this._isOpen($tmpItem)) {
        _this.open($tmpItem);
      }
    });
  };

  /**
   * 关闭所有项
   */
  Collapse.prototype.closeAll = function () {
    var _this = this;

    _this.$collapse.children('.' + _this.class_item).each(function () {
      var $tmpItem = $(this);

      if (_this._isOpen($tmpItem)) {
        _this.close($tmpItem);
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
    return new CollapsePrivate(selector, opts, 'collapse');
  }

  return Collapse;
})();

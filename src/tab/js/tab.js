/**
 * =============================================================================
 * ************   Tab   ************
 * =============================================================================
 */

mdui.Tab = (function () {

  var DEFAULT = {
    trigger: 'click',       // 触发方式 click: 鼠标点击切换 hover: 鼠标悬浮切换
    //animation: false,       // 切换时是否显示动画
    loop: false,            // 为true时，在最后一个选项卡时调用 next() 方法会回到第一个选项卡
  };

  // 元素是否已禁用
  var isDisabled = function ($ele) {
    return $ele[0].disabled || $ele.attr('disabled') !== null;
  };

  /**
   * 选项卡
   * @param selector
   * @param opts
   * @returns {*}
   * @constructor
   */
  function Tab(selector, opts) {
    var _this = this;

    _this.$tab = $(selector).eq(0);
    if (!_this.$tab.length) {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = _this.$tab.data('mdui.tab');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));
    _this.$tabs = _this.$tab.children('a');
    _this.$indicator = $('<div class="mdui-tab-indicator"></div>').appendTo(_this.$tab);
    _this.activeIndex = false;

    // 根据 url hash 获取默认激活的选项卡
    var hash = location.hash;
    if (hash) {
      _this.$tabs.each(function (i, tab) {
        if ($(tab).attr('href') === hash) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    // 含 mdui-tab-active 的元素默认激活
    if (_this.activeIndex === false) {
      _this.$tabs.each(function (i, tab) {
        if ($(tab).hasClass('mdui-tab-active')) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    // 默认激活第一个选项卡
    if (_this.activeIndex === false) {
      _this.activeIndex = 0;
    }

    // 设置激活状态选项卡
    _this._setActive();

    // 监听窗口大小变化事件，调整指示器位置
    $window.on('resize', $.throttle(function () {
      _this._setIndicatorPosition();
    }, 100));

    // 监听点击选项卡事件
    _this.$tabs.each(function (i, tab) {
      var $tab = $(tab);

      // 点击或鼠标移入触发的事件
      var clickEvent = function (e) {
        // 禁用状态的选项无法选中
        if (isDisabled($tab)) {
          e.preventDefault();
          return;
        }

        _this.activeIndex = i;
        _this._setActive();
      };

      // 无论 trigger 是 click 还是 hover，都会响应 click 事件
      $tab.on('click', clickEvent);

      // trigger 为 hover 时，额外响应 mouseenter 事件
      if (_this.options.trigger === 'hover') {
        $tab.on('mouseenter', clickEvent);
      }

      $tab.on('click', function (e) {
        // 阻止链接的默认点击动作
        if ($tab.attr('href').indexOf('#') === 0) {
          e.preventDefault();
        }
      });
    });
  }

  /**
   * 设置激活状态的选项卡
   */
  Tab.prototype._setActive = function () {
    var _this = this;

    _this.$tabs.each(function (i, tab) {
      var $tab = $(tab);
      var targetId = $tab.attr('href');

      // 设置选项卡激活状态
      if (i === _this.activeIndex && !isDisabled($tab)) {
        if (!$tab.hasClass('mdui-tab-active')) {
          componentEvent('change', 'tab', _this, _this.$tab, {
            index: _this.activeIndex,
            target: tab,
          });
          componentEvent('show', 'tab', _this, $tab);

          $tab.addClass('mdui-tab-active');
        }

        $(targetId).show();
        _this._setIndicatorPosition();
      } else {
        $tab.removeClass('mdui-tab-active');
        $(targetId).hide();
      }
    });
  };

  /**
   * 设置选项卡指示器的位置
   */
  Tab.prototype._setIndicatorPosition = function () {
    var _this = this;

    var $activeTab = _this.$tabs.eq(_this.activeIndex);
    if (isDisabled($activeTab)) {
      return;
    }

    var activeTabOffset = $activeTab.offset();
    _this.$indicator.css({
      left: activeTabOffset.left + _this.$tab[0].scrollLeft -
            _this.$tab[0].getBoundingClientRect().left + 'px',
      width: $activeTab.width() + 'px',
    });
  };

  /**
   * 切换到下一个选项卡
   */
  Tab.prototype.next = function () {
    var _this = this;

    if (_this.$tabs.length > _this.activeIndex + 1) {
      _this.activeIndex++;
    } else if (_this.options.loop) {
      _this.activeIndex = 0;
    }

    _this._setActive();
  };

  /**
   * 切换到上一个选项卡
   */
  Tab.prototype.prev = function () {
    var _this = this;

    if (_this.activeIndex > 0) {
      _this.activeIndex--;
    } else if (_this.options.loop) {
      _this.activeIndex = _this.$tabs.length - 1;
    }

    _this._setActive();
  };

  /**
   * 显示指定序号或指定id的选项卡
   * @param index 从0开始的序号，或以#开头的id
   */
  Tab.prototype.show = function (index) {
    var _this = this;

    if (parseInt(index) === index) {
      _this.activeIndex = index;
    } else {
      _this.$tabs.each(function (i, tab) {
        if (tab.id === index) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    _this._setActive();
  };

  /**
   * 在父元素的宽度变化时，需要调用该方法重新调整指示器位置
   */
  Tab.prototype.handleUpdate = function () {
    this._setIndicatorPosition();
  };

  return Tab;
})();

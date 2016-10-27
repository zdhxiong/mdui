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

  /**
   * 选项卡
   * @param selector
   * @param opts
   * @returns {*}
   * @constructor
   */
  function Tab(selector, opts) {
    var _this = this;
    var trigger;

    _this.tab = $.dom(selector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.getData(_this.tab, 'mdui.tab');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.tabs = $.children(_this.tab, 'a');

    _this.indicator = $.dom('<div class="mdui-tab-indicator"></div>')[0];

    // 选项卡下面添加的指示符
    _this.tab.appendChild(_this.indicator);

    // 触发方式
    if (mdui.support.touch) {
      trigger = 'touchend';
    } else if (_this.options.trigger === 'hover') {
      trigger = 'mouseenter';
    } else {
      trigger = 'click';
    }

    // 根据 url hash 获取默认激活的选项卡
    var hash = location.hash;
    if (hash) {
      $.each(_this.tabs, function (i, tab) {
        if (tab.getAttribute('href') === hash) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    // li 元素含 mdui-tab-active 的默认激活
    if (typeof _this.activeIndex === 'undefined') {
      $.each(_this.tabs, function (i, tab) {
        if (tab.classList.contains('mdui-tab-active')) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    // 默认激活第一个选项卡
    if (typeof _this.activeIndex === 'undefined') {
      _this.activeIndex = 0;
    }

    // 设置激活状态选项卡
    _this._setActive();

    // 监听窗口大小变化事件，调整指示器位置
    $.on(window, 'resize', mdui.throttle(function () {
      _this._setIndicatorPosition();
    }, 100));

    // 监听点击选项卡事件
    $.each(_this.tabs, function (i, tab) {
      $.on(tab, trigger, function (e) {
        if (tab.classList.contains('mdui-tab-disabled')) {
          e.preventDefault();
          return;
        }

        _this.activeIndex = i;
        _this._setActive();
      });

      $.on(tab, 'click', function (e) {
        // 阻止链接的默认点击动作
        if (tab.getAttribute('href').indexOf('#') === 0) {
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

    $.each(_this.tabs, function (i, tab) {
      var targetId = tab.getAttribute('href');
      var targetContent;

      if (tab.classList.contains('mdui-tab-disabled')) {
        if (targetId.indexOf('#') === 0) {
          targetContent = $.query(targetId);
          if (targetContent) {
            targetContent.style.display = 'none';
          }
        }

        return;
      }

      // 选项卡激活状态
      if (i === _this.activeIndex) {
        $.pluginEvent('change', 'tab', _this, _this.tab, {
          index: _this.activeIndex,
          id: targetId.indexOf('#') === 0 ? targetId.substr(0, 1) : null,
        });
        $.pluginEvent('show', 'tab', _this, tab);

        if (!tab.classList.contains('mdui-tab-active')) {
          tab.classList.add('mdui-tab-active');
        }
      } else {
        if (tab.classList.contains('mdui-tab-active')) {
          tab.classList.remove('mdui-tab-active');
        }
      }

      // 选项卡内容显示切换
      if (targetId.indexOf('#') === 0) {
        targetContent = $.query(targetId);
        if (targetContent) {
          if (i === _this.activeIndex) {
            targetContent.style.display = 'block';
          } else {
            targetContent.style.display = 'none';
          }
        }
      }

    });

    _this._setIndicatorPosition();
  };

  /**
   * 设置选项卡指示器的位置
   */
  Tab.prototype._setIndicatorPosition = function () {
    var _this = this;

    var activeTab = _this.tabs[_this.activeIndex];
    if (activeTab.classList.contains('mdui-tab-disabled')) {
      return;
    }

    var activeTabOffset = $.offset(activeTab);
    _this.indicator.style.left =
      activeTabOffset.left + _this.tab.scrollLeft - _this.tab.getBoundingClientRect().left + 'px';
    _this.indicator.style.width = $.getStyle(activeTab, 'width');
  };

  /**
   * 切换到下一个选项卡
   */
  Tab.prototype.next = function () {
    var _this = this;

    if (_this.tabs.length > _this.activeIndex + 1) {
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
      _this.activeIndex = _this.tabs.length - 1;
    }

    _this._setActive();
  };

  /**
   * 显示指定序号或指定id的选项卡
   * @param index 从0开始的序号，或以#开头的id
   */
  Tab.prototype.show = function (index) {
    var _this = this;

    if (index.indexOf('#') === 0) {
      $.each(_this.tabs, function (i, tab) {
        if (tab.getAttribute('href') === index) {
          _this.activeIndex = i;
          return false;
        }
      });
    } else {
      _this.activeIndex = index;
    }

    _this._setActive();
  };

  return Tab;
})();

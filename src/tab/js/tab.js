/**
 * =============================================================================
 * ************   Tab   ************
 * =============================================================================
 */

mdui.Tab = (function () {

  var DEFAULT = {
    trigget: 'click',       // 触发方式 click: 鼠标点击切换 hover: 鼠标悬浮切换
    animation: false,       // 切换时是否显示动画
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
    _this.indicator = $.dom('<div class="mdui-tab-indicator"></div>')[0];

    _this.tab = $.dom(selector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.getData(_this.tab, 'mdui.tab');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.tabs = $.children(_this.tab, 'a');

    // li 元素含 mdui-tab-active 的默认激活
    $.each(_this.tabs, function (i, tab) {
      if (tab.classList.contains('mdui-tab-active')) {
        _this.activeIndex = i;
      }
    });

    // 根据 url hash 获取默认激活的选项卡
    if (typeof _this.activeIndex === 'undefined') {
      var hash = location.hash;
      $.each(_this.tabs, function (i, tab) {
        if (tab.getAttribute('href') === hash) {
          _this.activeIndex = i;
        }
      });
    }

    // 默认激活第一个选项卡
    if (typeof _this.activeIndex === 'undefined') {
      _this.activeIndex = 0;
    }

    // 添加选项卡的下划线
    _this.tab.appendChild(_this.indicator);
    _this._setIndicatorPosition();
  }

  /**
   * 设置选项卡指示器的位置
   * @private
   */
  Tab.prototype._setIndicatorPosition = function () {
    var _this = this;

    var tabOffset = $.offset(_this.tab);
    var activeTabOffset = $.offset(_this.tabs[_this.activeIndex]);
    console.log(tabOffset);
    console.log(activeTabOffset);

    _this.indicator.style.left = activeTabOffset.left - tabOffset.left + 'px';
    _this.indicator.style.right =
      parseFloat($.getStyle(_this.tab, 'width').replace('px', '')) -
      activeTabOffset.left + tabOffset.left -
      parseFloat($.getStyle(_this.tabs[_this.activeIndex], 'width').replace('px', '')) + 'px';
  };

  /**
   * 切换到下一个选项卡
   */
  Tab.prototype.next = function () {

  };

  /**
   * 切换到上一个选项卡
   */
  Tab.prototype.prev = function () {

  };

  /**
   * 显示指定序号或指定id的选项卡
   * @param index 从0开始的序号，或以#开头的id
   */
  Tab.prototype.show = function (index) {

  };

  return Tab;
})();

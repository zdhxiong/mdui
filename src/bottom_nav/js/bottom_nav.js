/**
 * =============================================================================
 * ************   Bottom navigation 底部导航栏   ************
 * =============================================================================
 */

(function () {

  /**
   * 底部导航栏
   * @param selector
   * @constructor
   */
  function BottomNav(selector) {
    var _this = this;

    _this.bottomNav = $.dom(selector)[0];
    _this.bottomNavs = $.children(_this.bottomNav, 'a');

    // 含 mdui-bottom-nav-active 的元素默认激活
    if (typeof _this.activeIndex === 'undefined') {
      $.each(_this.bottomNavs, function (i, bottomNav) {
        if (bottomNav.classList.contains('mdui-bottom-nav-active')) {
          _this.activeIndex = i;
          return false;
        }
      });
    }

    // 默认激活第一个
    if (typeof _this.activeIndex === 'undefined') {
      _this.activeIndex = 0;
    }

    _this._setActive();

    // 监听点击事件
    $.each(_this.bottomNavs, function (i, bottomNav) {
      $.on(bottomNav, 'click', function () {
        _this.activeIndex = i;
        _this._setActive();
      });
    });
  }

  /**
   * 设置默认激活状态的导航项
   */
  BottomNav.prototype._setActive = function () {
    var _this = this;

    $.each(_this.bottomNavs, function (i, bottomNav) {
      if (i === _this.activeIndex) {
        $.pluginEvent('change', 'bottom-nav', _this, _this.bottomNav, {
          index: _this.activeIndex,
        });

        if (!bottomNav.classList.contains('mdui-bottom-nav-active')) {
          bottomNav.classList.add('mdui-bottom-nav-active');
        }
      } else {
        if (bottomNav.classList.contains('mdui-bottom-nav-active')) {
          bottomNav.classList.remove('mdui-bottom-nav-active');
        }
      }
    });
  };

  $.ready(function () {

    // 实例化插件
    $.each($.queryAll('.mdui-bottom-nav'), function (i, target) {
      var inst = $.getData(target, 'mdui-bottom-nav');
      if (!inst) {
        inst = new BottomNav(target);
        $.setData(target, 'mdui-bottom-nav', inst);
      }
    });
  });

})();

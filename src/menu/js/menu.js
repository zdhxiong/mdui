/**
 * =============================================================================
 * ************   Menu 菜单   ************
 * =============================================================================
 */

mdui.Menu = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    trigger: 'click',         // 菜单触发方式 click、hover
    delay: 0,                 // 菜单的触发延时，仅在 trigger 为 hover 时有效
    position: 'bottom',       // 菜单位置 top、bottom
    align: 'left',            // 菜单和触发它的元素的对齐方式
    subMenuTrigger: 'hover',  // 子菜单的触发方式
    subMenuDelay: 200,        // 子菜单的触发延时，仅在 submenuTrigger 为 hover 有效
  };

  /**
   * 菜单
   * @param anchorSelector 点击该元素触发菜单
   * @param menuSelector 菜单
   * @param opts 配置项
   * @constructor
   */
  function Menu(anchorSelector, menuSelector, opts) {
    var _this = this;
    var timeout;

    // 触发菜单的元素
    _this.anchor = $.dom(anchorSelector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.getData(_this.anchor, 'mdui.menu');
    if (oldInst) {
      return oldInst;
    }

    _this.menu = $.dom(menuSelector)[0];
    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 点击触发
    if (_this.options.trigger === 'click') {
      $.on(_this.anchor, 'click', function () {
        _this.toggle();
      });
    }

    // 鼠标悬浮出发
    if (_this.options.trigger === 'hover') {
      $.on(_this.anchor, 'mouseenter', function () {
        if (_this.options.delay) {
          timeout = setTimeout(function () {
            _this.open();
          }, _this.options.delay);
        } else {
          _this.open();
        }
      });

      $.on(_this.anchor, 'mouseleave', function () {
        _this.close();
        clearTimeout(timeout);
      });
    }
  }

  /**
   * 切换菜单状态
   */
  Menu.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  /**
   * 打开菜单
   */
  Menu.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }
  };

  /**
   * 关闭菜单
   */
  Menu.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }
  };
})();

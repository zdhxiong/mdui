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
    position: 'auto',         // 菜单位置 top、bottom、auto
    align: 'auto',            // 菜单和触发它的元素的对齐方式 left、right、auto
    subMenuTrigger: 'hover',  // 子菜单的触发方式
    subMenuDelay: 200,        // 子菜单的触发延时，仅在 submenuTrigger 为 hover 有效
    history: false,           // 监听 hashchange 事件
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
    $.on(_this.anchor, 'click', function () {
      _this.toggle();
    });

    // 点击除了菜单本身以外的地方都关闭菜单
    $.on(document, 'click', function (e) {
      console.log(e.target);
      if (
        !$.is(e.target, _this.menu) &&
        !$.is(e.target, _this.anchor) &&
        !$.child(e.target, '.mdui-menu-more')
      ) {
        _this.close();
      }
    });
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

    var anchorOffset = $.offset(_this.anchor);

    // var menuOffset = $.offset(_this.menu);

    _this.menu.style.left = anchorOffset.left + 'px';
    _this.menu.style.top = anchorOffset.top + 'px';

    if (_this.options.position === 'auto') {
      console.log('');
    }

    if (_this.options.align === 'auto') {
      console.log('');
    }

    // 打开菜单
    _this.menu.classList.add('mdui-menu-open');
    _this.state = 'opening';
    $.pluginEvent('open', 'menu', _this, _this.menu);

    // 打开动画完成后
    $.transitionEnd(_this.menu, function () {
      _this.state = 'opened';
      $.pluginEvent('opened', 'menu', _this, _this.menu);
    });
  };

  /**
   * 关闭菜单
   */
  Menu.prototype.close = function () {
    var _this = this;
    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    _this.menu.classList.remove('mdui-menu-open');
    _this.state = 'closing';
    $.pluginEvent('close', 'menu', _this, _this.menu);

    $.transitionEnd(_this.menu, function () {
      _this.state = 'closed';
      $.pluginEvent('closed', 'menu', _this, _this.menu);
    });
  };

  return Menu;
})();

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
    covered: 'auto',          // 菜单是否覆盖在触发它的元素上，true、false。auto 时简单菜单覆盖，级联菜单不覆盖
    position: 'auto',         // 菜单位置 top、bottom、center、auto
    align: 'auto',            // 菜单和触发它的元素的对齐方式 left、right、center、auto
    gutter: 16,               // 菜单距离窗口边缘的最小距离，单位 px
    subMenuTrigger: 'hover',  // 子菜单的触发方式
    subMenuDelay: 200,        // 子菜单的触发延时，仅在 submenuTrigger 为 hover 有效
    history: false,           // 监听 hashchange 事件
  };

  /**
   * 调整菜单位置
   * @param _this 实例
   */
  var readjust = function (_this) {
    var menuLeft;
    var menuTop;
    var position;
    var align;
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    var menuStyleTemp = $.getStyle(_this.menu);
    var menuWidth = parseFloat(menuStyleTemp.width.replace('px', ''));
    var menuHeight = parseFloat(menuStyleTemp.height.replace('px', ''));

    var anchorOffset = $.offset(_this.anchor);
    var menuOffset = $.offset(_this.menu);

    // 自动判断菜单位置
    if (_this.options.position === 'auto') {
      var bottomHeightTemp = windowHeight - anchorOffset.offsetTop - anchorOffset.height;
      var topHeightTemp = anchorOffset.offsetTop;

      // 判断下方是否放得下菜单
      if (bottomHeightTemp + (_this.isCovered ? anchorOffset.height : 0) > menuHeight + _this.options.gutter) {
        position = 'bottom';
      }

      // 判断上方是否放得下菜单
      else if (topHeightTemp + (_this.isCovered ? anchorOffset.height : 0) > menuOffset.height + _this.options.gutter) {
        position = 'top';
      }

      // 上下都放不下，居中显示
      else {
        position = 'center';
      }
    } else {
      position = _this.options.position;
    }

    // 自动判断菜单对齐方式
    if (_this.options.align === 'auto') {
      var leftWidthTemp = anchorOffset.offsetLeft;
      var rightWidthTemp = windowWidth - anchorOffset.offsetLeft - anchorOffset.width;

      // 判断右侧是否放得下菜单
      if (rightWidthTemp + anchorOffset.width > menuOffset.width + _this.options.gutter) {
        align = 'left';
      }

      // 判断左侧是否放得下菜单
      else if (leftWidthTemp + anchorOffset.width > menuOffset.width + _this.options.gutter) {
        align = 'right';
      }

      // 左右都放不下，居中显示
      else {
        align = 'center';
      }
    } else {
      align = _this.options.align;
    }

    // 设置菜单位置
    if (position === 'bottom') {
      menuTop = anchorOffset.top + (_this.isCovered ? 0 : anchorOffset.height);
    } else if (position === 'top') {
      menuTop = anchorOffset.top - menuOffset.height + (_this.isCovered ? anchorOffset.height : 0);
    } else {
      // =====================居中
      // 显示的菜单高度，菜单高度不能超过窗口高度
      var menuHeightTemp;

      // 菜单比窗口高，限制菜单高度
      if (menuOffset.height + _this.options.gutter*2 > window.innerHeight) {
        menuHeightTemp = windowHeight - _this.options.gutter*2;
        _this.menu.style.height = menuHeightTemp + 'px';
      } else {
        menuHeightTemp = menuOffset.height;
      }

      menuTop = (windowHeight - menuHeightTemp) / 2;
    }
    _this.menu.style.top = menuTop + 'px';

    // 设置菜单对齐方式
    console.log(align);
    if (align === 'left') {
      menuLeft = anchorOffset.left;
    } else if (align === 'right') {
      menuLeft = anchorOffset.width + anchorOffset.left - menuOffset.width;
    } else {
      //=======================居中
    }
    _this.menu.style.left = menuLeft + 'px';




  }

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

    // 是否是级联菜单
    _this.isCascade = !!_this.menu.classList.contains('mdui-menu-cascade');

    // covered 参数处理
    if (_this.options.covered === 'auto') {
      _this.isCovered = !_this.isCascade;
    } else {
      _this.isCovered = _this.options.covered;
    }

    // 点击触发菜单切换
    $.on(_this.anchor, 'click', function () {
      _this.toggle();
    });

    // 点击除了菜单本身以外的地方都关闭菜单
    $.on(document, 'click', function (e) {
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

    // 调整菜单位置
    readjust(_this);

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

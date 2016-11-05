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
    var windowWidth = document.body.clientWidth;
    var gutter = _this.options.gutter;

    // 菜单宽度高度
    var menuWidth = parseFloat($.getStyle(_this.menu, 'width'));
    var menuHeight = parseFloat($.getStyle(_this.menu, 'height'));

    // 触发元素的宽度高度
    var anchorWidth = parseFloat($.getStyle(_this.anchor, 'width'));
    var anchorHeight = parseFloat($.getStyle(_this.anchor, 'height'));

    // 触发元素的位置
    var anchorOffset = $.offset(_this.anchor);

    // ===============================
    // ================= 自动判断菜单位置
    // ===============================
    if (_this.options.position === 'auto') {
      var bottomHeightTemp = windowHeight - anchorOffset.offsetTop - anchorHeight;
      var topHeightTemp = anchorOffset.offsetTop;

      // 判断下方是否放得下菜单
      if (bottomHeightTemp + (_this.isCovered ? anchorHeight : 0) > menuHeight + gutter) {
        position = 'bottom';
      }

      // 判断上方是否放得下菜单
      else if (topHeightTemp + (_this.isCovered ? anchorHeight : 0) > menuHeight + gutter) {
        position = 'top';
      }

      // 上下都放不下，居中显示
      else {
        position = 'center';
      }
    } else {
      position = _this.options.position;
    }

    // ===============================
    // ============== 自动判断菜单对齐方式
    // ===============================
    if (_this.options.align === 'auto') {
      var leftWidthTemp = anchorOffset.offsetLeft;
      var rightWidthTemp = windowWidth - anchorOffset.offsetLeft - anchorWidth;

      // 判断右侧是否放得下菜单
      if (rightWidthTemp + anchorWidth > menuWidth + gutter) {
        align = 'left';
      }

      // 判断左侧是否放得下菜单
      else if (leftWidthTemp + anchorWidth > menuWidth + gutter) {
        align = 'right';
      }

      // 左右都放不下，居中显示
      else {
        align = 'center';
      }
    } else {
      align = _this.options.align;
    }

    // ===============================
    // ==================== 设置菜单位置
    // ===============================
    if (position === 'bottom') {
      menuTop = anchorOffset.top + (_this.isCovered ? 0 : anchorHeight);
    } else if (position === 'top') {
      menuTop = anchorOffset.top - menuHeight + (_this.isCovered ? anchorHeight : 0);
    } else {
      // =====================在窗口中居中
      // 显示的菜单高度，菜单高度不能超过窗口高度
      var menuHeightTemp;

      // 菜单比窗口高，限制菜单高度
      if (menuHeight + gutter * 2 > windowHeight) {
        menuHeightTemp = windowHeight - gutter * 2;
        _this.menu.style.height = menuHeightTemp + 'px';
      } else {
        menuHeightTemp = menuHeight;
      }

      menuTop = anchorOffset.top - anchorOffset.offsetTop + (windowHeight - menuHeightTemp) / 2;
    }

    _this.menu.style.top = menuTop + 'px';

    // ===============================
    // ================= 设置菜单对齐方式
    // ===============================
    if (align === 'left') {
      menuLeft = anchorOffset.left;
    } else if (align === 'right') {
      menuLeft = anchorWidth + anchorOffset.left - menuWidth;
    } else {
      //=======================在窗口中居中
      // 显示的菜单的宽度，菜单宽度不能超过窗口宽度
      var menuWidthTemp;

      // 菜单比窗口宽，限制菜单宽度
      if (menuWidth + gutter * 2 > windowWidth) {
        menuWidthTemp = windowWidth - gutter * 2;
        _this.menu.style.width = menuWidthTemp + 'px';
      } else {
        menuWidthTemp = menuWidth;
      }

      menuLeft = anchorOffset.left - anchorOffset.offsetLeft + (windowWidth - menuWidthTemp) / 2;
    }

    _this.menu.style.left = menuLeft + 'px';
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

    // 窗口大小变化时，重新调整菜单位置
    $.on(window, 'resize', mdui.throttle(function () {
      readjust(_this);
    }, 100));
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

    // 关闭动画完成后
    $.transitionEnd(_this.menu, function () {
      _this.state = 'closed';
      $.pluginEvent('closed', 'menu', _this, _this.menu);

      // 关闭后，恢复菜单样式到默认状态
      _this.menu.style.top = '';
      _this.menu.style.left = '';
      _this.menu.style.width = '';
    });
  };

  return Menu;
})();

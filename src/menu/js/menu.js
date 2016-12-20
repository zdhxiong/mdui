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
    position: 'auto',         // 菜单位置 top、bottom、center、auto
    align: 'auto',            // 菜单和触发它的元素的对齐方式 left、right、center、auto
    gutter: 16,               // 菜单距离窗口边缘的最小距离，单位 px
    fixed: false,             // 是否使菜单固定在窗口，不随滚动条滚动
    covered: 'auto',          // 菜单是否覆盖在触发它的元素上，true、false。auto 时简单菜单覆盖，级联菜单不覆盖
    subMenuTrigger: 'hover',  // 子菜单的触发方式 hover、click
    subMenuDelay: 200,        // 子菜单的触发延时，仅在 submenuTrigger 为 hover 有效
  };

  /**
   * 类名
   */
  var CLASS = {
    menu: 'mdui-menu',                    // 菜单基础类
    cascade: 'mdui-menu-cascade',         // 级联菜单
    open: 'mdui-menu-open',               // 打开状态的菜单
    item: 'mdui-menu-item',               // 菜单条目
    active: 'mdui-menu-item-active',      // 激活状态的菜单
    divider: 'mdui-divider',              // 分隔线
  };

  /**
   * 调整主菜单位置
   * @param _this 实例
   */
  var readjust = function (_this) {
    var menuLeft;
    var menuTop;

    // 菜单位置和方向
    var position;
    var align;

    // window 窗口的宽度和高度
    var windowHeight = document.documentElement.clientHeight;
    var windowWidth = document.documentElement.clientWidth;

    // 配置参数
    var gutter = _this.options.gutter;
    var isCovered = _this.isCovered;
    var isFixed = _this.options.fixed;

    // 动画方向参数
    var transformOriginX;
    var transformOriginY;

    // 菜单的原始宽度和高度
    var menuWidth = parseFloat($.getStyle(_this.menu, 'width'));
    var menuHeight = parseFloat($.getStyle(_this.menu, 'height'));

    var anchor = _this.anchor;

    // 触发菜单的元素在窗口中的位置
    var anchorTmp = anchor.getBoundingClientRect();
    var anchorTop = anchorTmp.top;
    var anchorLeft = anchorTmp.left;
    var anchorHeight = anchorTmp.height;
    var anchorWidth = anchorTmp.width;
    var anchorBottom = windowHeight - anchorTop - anchorHeight;
    var anchorRight = windowWidth - anchorLeft - anchorWidth;

    // 触发元素相对其拥有定位属性的父元素的位置
    var anchorOffsetTop = anchor.offsetTop;
    var anchorOffsetLeft = anchor.offsetLeft;

    // ===============================
    // ================= 自动判断菜单位置
    // ===============================
    if (_this.options.position === 'auto') {

      // 判断下方是否放得下菜单
      if (anchorBottom + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
        position = 'bottom';
      }

      // 判断上方是否放得下菜单
      else if (anchorTop + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
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

      // 判断右侧是否放得下菜单
      if (anchorRight + anchorWidth > menuWidth + gutter) {
        align = 'left';
      }

      // 判断左侧是否放得下菜单
      else if (anchorLeft + anchorWidth > menuWidth + gutter) {
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
      transformOriginY = '0';

      menuTop =
        (isCovered ? 0 : anchorHeight) +
        (isFixed ? anchorTop : anchorOffsetTop);

    } else if (position === 'top') {
      transformOriginY = '100%';

      menuTop =
        (isCovered ? anchorHeight : 0) +
        (isFixed ? (anchorTop - menuHeight) : (anchorOffsetTop - menuHeight));

    } else {
      transformOriginY = '50%';

      // =====================在窗口中居中
      // 显示的菜单的高度，简单菜单高度不超过窗口高度，若超过了则在菜单内部显示滚动条
      // 级联菜单内部不允许出现滚动条
      var menuHeightTemp = menuHeight;

      // 简单菜单比窗口高时，限制菜单高度
      if (!_this.menu.classList.contains('mdui-menu-cascade')) {
        if (menuHeight + gutter * 2 > windowHeight) {
          menuHeightTemp = windowHeight - gutter * 2;
          _this.menu.style.height = menuHeightTemp + 'px';
        }
      }

      menuTop =
        (windowHeight - menuHeightTemp) / 2 +
        (isFixed ? 0 : (anchorOffsetTop - anchorTop));
    }

    _this.menu.style.top = menuTop + 'px';

    // ===============================
    // ================= 设置菜单对齐方式
    // ===============================
    if (align === 'left') {
      transformOriginX = '0';

      menuLeft = isFixed ? anchorLeft : anchorOffsetLeft;

    } else if (align === 'right') {
      transformOriginX = '100%';

      menuLeft = isFixed ?
        (anchorLeft + anchorWidth - menuWidth) :
        (anchorOffsetLeft + anchorWidth - menuWidth);
    } else {
      transformOriginX = '50%';

      //=======================在窗口中居中
      // 显示的菜单的宽度，菜单宽度不能超过窗口宽度
      var menuWidthTemp = menuWidth;

      // 菜单比窗口宽，限制菜单宽度
      if (menuWidth + gutter * 2 > windowWidth) {
        menuWidthTemp = windowWidth - gutter * 2;
        _this.menu.style.width = menuWidthTemp + 'px';
      }

      menuLeft =
        (windowWidth - menuWidthTemp) / 2 +
        (isFixed ? 0 : anchorOffsetLeft - anchorLeft);
    }

    _this.menu.style.left = menuLeft + 'px';

    // 设置菜单动画方向
    $.transformOrigin(_this.menu, transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 调整子菜单的位置
   * @param submenu
   */
  var readjustSubmenu = function (submenu) {
    var item = $.parent(submenu, '.' + CLASS.item);

    var submenuTop;
    var submenuLeft;

    // 子菜单位置和方向
    var position; // top、bottom
    var align; // left、right

    // window 窗口的宽度和高度
    var windowHeight = document.documentElement.clientHeight;
    var windowWidth = document.documentElement.clientWidth;

    // 动画方向参数
    var transformOriginX;
    var transformOriginY;

    // 子菜单的原始宽度和高度
    var submenuWidth = parseFloat($.getStyle(submenu, 'width'));
    var submenuHeight = parseFloat($.getStyle(submenu, 'height'));

    // 触发子菜单的菜单项的宽度高度
    var itemTmp = item.getBoundingClientRect();
    var itemWidth = itemTmp.width;
    var itemHeight = itemTmp.height;
    var itemLeft = itemTmp.left;
    var itemTop = itemTmp.top;

    // ===================================
    // ===================== 判断菜单上下位置
    // ===================================

    // 判断下方是否放得下菜单
    if (windowHeight - itemTop > submenuHeight) {
      position = 'bottom';
    }

    // 判断上方是否放得下菜单
    else if (itemTop + itemHeight > submenuHeight) {
      position = 'top';
    }

    // 默认放在下方
    else {
      position = 'bottom';
    }

    // ====================================
    // ====================== 判断菜单左右位置
    // ====================================

    // 判断右侧是否放得下菜单
    if (windowWidth - itemLeft - itemWidth > submenuWidth) {
      align = 'left';
    }

    // 判断左侧是否放得下菜单
    else if (itemLeft > submenuWidth) {
      align = 'right';
    }

    // 默认放在右侧
    else {
      align = 'left';
    }

    // ===================================
    // ======================== 设置菜单位置
    // ===================================
    if (position === 'bottom') {
      transformOriginY = '0';
      submenuTop = '0';
    } else if (position === 'top') {
      transformOriginY = '100%';
      submenuTop = -submenuHeight + itemHeight;
    }

    submenu.style.top = submenuTop + 'px';

    // ===================================
    // ===================== 设置菜单对齐方式
    // ===================================
    if (align === 'left') {
      transformOriginX = '0';
      submenuLeft = itemWidth;
    } else if (align === 'right') {
      transformOriginX = '100%';
      submenuLeft = -submenuWidth;
    }

    submenu.style.left = submenuLeft + 'px';

    // 设置菜单动画方向
    $.transformOrigin(submenu, transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 打开子菜单
   * @param submenu
   */
  var openSubMenu = function (submenu) {
    readjustSubmenu(submenu);
    submenu.classList.add(CLASS.open);

    // 菜单项上添加激活状态的样式
    var item = $.parent(submenu, '.' + CLASS.item);
    item.classList.add(CLASS.active);
  };

  /**
   * 关闭子菜单，及其嵌套的子菜单
   * @param submenu
   */
  var closeSubMenu = function (submenu) {
    var item;

    // 关闭子菜单
    submenu.classList.remove(CLASS.open);

    // 移除激活状态的样式
    item = $.parent(submenu, '.' + CLASS.item);
    item.classList.remove(CLASS.active);

    // 循环关闭嵌套的子菜单
    var submenus = $.queryAll('.' + CLASS.menu, submenu);
    $.each(submenus, function (i, tmp) {
      tmp.classList.remove(CLASS.open);

      // 移除激活状态的样式
      item = $.parent(tmp, '.' + CLASS.item);
      item.classList.remove(CLASS.active);
    });
  };

  /**
   * 切换子菜单状态
   * @param submenu
   */
  var toggleSubMenu = function (submenu) {
    if (submenu.classList.contains(CLASS.open)) {
      closeSubMenu(submenu);
    } else {
      openSubMenu(submenu);
    }
  };

  /**
   * 绑定子菜单事件
   * @param inst 实例
   */
  var bindSubMenuEvent = function (inst) {
    var trigger;
    var delay;

    if (inst.options.subMenuTrigger === 'hover' && !mdui.support.touch) {
      trigger = 'mouseover mouseout';
      delay = inst.options.subMenuDelay;
    } else {
      trigger = 'click';
      delay = 0;
    }

    // subMneuTrigger: 'click'
    if (trigger === 'click') {
      $.on(inst.menu, trigger, '.' + CLASS.item, function (e) {
        var _this = this;

        // 禁用状态菜单不操作
        if (_this.getAttribute('disabled') !== null) {
          return;
        }

        // 没有点击在子菜单的菜单项上时，不操作（点在了子菜单的空白区域、或分隔线上）
        if ($.is(e.target, '.' + CLASS.menu) || $.is(e.target, '.' + CLASS.divider)) {
          return;
        }

        // 阻止冒泡，点击菜单项时只在最后一级的 mdui-menu-item 上生效，不向上冒泡
        if ($.parents(e.target, '.' + CLASS.item)[0] !== _this) {
          return;
        }

        var submenu = $.child(_this, '.' + CLASS.menu);

        // 先关闭除当前子菜单外的所有同级子菜单
        var menu = $.parent(_this, '.' + CLASS.menu);
        var items = $.children(menu, '.' + CLASS.item);
        $.each(items, function (i, item) {
          var tmpSubmenu = $.child(item, '.' + CLASS.menu);
          if (
            tmpSubmenu &&
            (!submenu || !$.is(tmpSubmenu, submenu))
          ) {
            closeSubMenu(tmpSubmenu);
          }
        });

        // 切换当前子菜单
        if (submenu) {
          toggleSubMenu(submenu);
        }
      });
    }

    // subMenuTrigger: 'hover'
    else {

      // 临时存储 setTimeout 对象
      var timeout;

      var timeoutOpen;
      var timeoutClose;

      $.on(inst.menu, trigger, '.' + CLASS.item, function (e) {
        var _this = this;
        var eventType = e.type;
        var relatedTarget = e.relatedTarget;

        // 禁用状态的菜单不操作
        if (_this.getAttribute('disabled') !== null) {
          return;
        }

        // 用 mouseover 模拟 mouseenter
        if (eventType === 'mouseover') {
          if (_this !== relatedTarget && $.contains(_this, relatedTarget)) {
            return;
          }
        }

        // 用 mouseout 模拟 mouseleave
        else if (eventType === 'mouseout') {
          if (_this === relatedTarget || $.contains(_this, relatedTarget)) {
            return;
          }
        }

        // 当前菜单项下的子菜单，未必存在
        var submenu = $.child(_this, '.' + CLASS.menu);

        // 鼠标移入菜单项时，显示菜单项下的子菜单
        if (eventType === 'mouseover') {
          if (submenu) {

            // 当前子菜单准备打开时，如果当前子菜单正准备着关闭，不用再关闭了
            var tmpClose = $.data(submenu, 'timeoutClose.mdui.menu');
            if (tmpClose) {
              clearTimeout(tmpClose);
            }

            // 如果当前子菜单已经打开，不操作
            if (submenu.classList.contains(CLASS.open)) {
              return;
            }

            // 当前子菜单准备打开时，其他准备打开的子菜单不用再打开了
            clearTimeout(timeoutOpen);

            // 准备打开当前子菜单
            timeout = timeoutOpen = setTimeout(function () {
              openSubMenu(submenu);
            }, delay);

            $.data(submenu, 'timeoutOpen.mdui.menu', timeout);
          }
        }

        // 鼠标移出菜单项时，关闭菜单项下的子菜单
        else if (eventType === 'mouseout') {
          if (submenu) {

            // 鼠标移出菜单项时，如果当前菜单项下的子菜单正准备打开，不用再打开了
            var tmpOpen = $.data(submenu, 'timeoutOpen.mdui.menu');
            if (tmpOpen) {
              clearTimeout(tmpOpen);
            }

            // 准备关闭当前子菜单
            timeout = timeoutClose = setTimeout(function () {
              closeSubMenu(submenu);
            }, delay);

            $.data(submenu, 'timeoutClose.mdui.menu', timeout);
          }
        }
      });
    }
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
    if (typeof _this.anchor === 'undefined') {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.data(_this.anchor, 'mdui.menu');
    if (oldInst) {
      return oldInst;
    }

    _this.menu = $.dom(menuSelector)[0];

    // 触发菜单的元素 和 菜单必须时同级的元素，否则菜单可能不能定位
    if (!$.child(_this.anchor.parentNode, _this.menu)) {
      return;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 是否是级联菜单
    _this.isCascade = _this.menu.classList.contains(CLASS.cascade);

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

    // 点击菜单外面区域关闭菜单
    $.on(document, 'click touchstart', function (e) {
      if (
        (_this.state === 'opening' || _this.state === 'opened') &&
        !$.is(e.target, _this.menu) &&
        !$.contains(_this.menu, e.target) &&
        !$.is(e.target, _this.anchor) &&
        !$.contains(_this.anchor, e.target)
      ) {
        _this.close();
      }
    });

    // 点击不含子菜单的菜单条目关闭菜单
    $.on(document, 'click', '.' + CLASS.item, function () {
      if (!$.query('.' + CLASS.menu, this) && this.getAttribute('disabled') === null) {
        _this.close();
      }
    });

    // 绑定点击或鼠标移入含子菜单的条目的事件
    bindSubMenuEvent(_this);

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

    _this.state = 'opening';

    // 调整菜单位置
    readjust(_this);

    // 菜单隐藏状态使用使用 fixed 定位。
    _this.menu.style.position = _this.options.fixed ? 'fixed' : 'absolute';

    // 打开菜单
    _this.menu.classList.add(CLASS.open);
    $.pluginEvent('open', 'menu', _this, _this.menu);

    // 打开动画完成后
    $.transitionEnd(_this.menu, function () {

      // 如果打开动画结束前，菜单状态已经改变了，则不触发 opened 事件
      if (_this.state !== 'opening') {
        return;
      }

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

    _this.menu.classList.remove(CLASS.open);
    _this.state = 'closing';
    $.pluginEvent('close', 'menu', _this, _this.menu);

    // 菜单开始关闭时，关闭所有子菜单
    $.each($.queryAll('.mdui-menu', _this.menu), function (i, submenu) {
      closeSubMenu(submenu);
    });

    // 关闭动画完成后
    $.transitionEnd(_this.menu, function () {

      // 如果关闭动画完成前，菜单状态又改变了，则不触发 closed 事件
      if (_this.state !== 'closing') {
        return;
      }

      _this.state = 'closed';
      $.pluginEvent('closed', 'menu', _this, _this.menu);

      // 关闭后，恢复菜单样式到默认状态
      _this.menu.style.top = '';
      _this.menu.style.left = '';
      _this.menu.style.width = '';

      // 关闭后，恢复 fixed 定位
      _this.menu.style.position = 'fixed';
    });
  };

  return Menu;
})();

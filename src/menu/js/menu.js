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
    var windowHeight = $window.height();
    var windowWidth = $window.width();

    // 配置参数
    var gutter = _this.options.gutter;
    var isCovered = _this.isCovered;
    var isFixed = _this.options.fixed;

    // 动画方向参数
    var transformOriginX;
    var transformOriginY;

    // 菜单的原始宽度和高度
    var menuWidth = _this.$menu.width();
    var menuHeight = _this.$menu.height();

    var $anchor = _this.$anchor;

    // 触发菜单的元素在窗口中的位置
    var anchorTmp = $anchor[0].getBoundingClientRect();
    var anchorTop = anchorTmp.top;
    var anchorLeft = anchorTmp.left;
    var anchorHeight = anchorTmp.height;
    var anchorWidth = anchorTmp.width;
    var anchorBottom = windowHeight - anchorTop - anchorHeight;
    var anchorRight = windowWidth - anchorLeft - anchorWidth;

    // 触发元素相对其拥有定位属性的父元素的位置
    var anchorOffsetTop = $anchor[0].offsetTop;
    var anchorOffsetLeft = $anchor[0].offsetLeft;

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
      if (!_this.$menu.hasClass('mdui-menu-cascade')) {
        if (menuHeight + gutter * 2 > windowHeight) {
          menuHeightTemp = windowHeight - gutter * 2;
          _this.$menu.height(menuHeightTemp);
        }
      }

      menuTop =
        (windowHeight - menuHeightTemp) / 2 +
        (isFixed ? 0 : (anchorOffsetTop - anchorTop));
    }

    _this.$menu.css('top', menuTop + 'px');

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
        _this.$menu.width(menuWidthTemp);
      }

      menuLeft =
        (windowWidth - menuWidthTemp) / 2 +
        (isFixed ? 0 : anchorOffsetLeft - anchorLeft);
    }

    _this.$menu.css('left', menuLeft + 'px');

    // 设置菜单动画方向
    _this.$menu.transformOrigin(transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 调整子菜单的位置
   * @param $submenu
   */
  var readjustSubmenu = function ($submenu) {
    var $item = $submenu.parent('.mdui-menu-item');

    var submenuTop;
    var submenuLeft;

    // 子菜单位置和方向
    var position; // top、bottom
    var align; // left、right

    // window 窗口的宽度和高度
    var windowHeight = $window.height();
    var windowWidth = $window.width();

    // 动画方向参数
    var transformOriginX;
    var transformOriginY;

    // 子菜单的原始宽度和高度
    var submenuWidth = $submenu.width();
    var submenuHeight = $submenu.height();

    // 触发子菜单的菜单项的宽度高度
    var itemTmp = $item[0].getBoundingClientRect();
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

    $submenu.css('top', submenuTop + 'px');

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

    $submenu.css('left', submenuLeft + 'px');

    // 设置菜单动画方向
    $submenu.transformOrigin(transformOriginX + ' ' + transformOriginY);
  };

  /**
   * 打开子菜单
   * @param $submenu
   */
  var openSubMenu = function ($submenu) {
    readjustSubmenu($submenu);

    $submenu
      .addClass('mdui-menu-open')
      .parent('.mdui-menu-item')
      .addClass('mdui-menu-item-active');
  };

  /**
   * 关闭子菜单，及其嵌套的子菜单
   * @param $submenu
   */
  var closeSubMenu = function ($submenu) {
    // 关闭子菜单
    $submenu
      .removeClass('mdui-menu-open')
      .addClass('mdui-menu-closing')
      .transitionEnd(function () {
        $submenu.removeClass('mdui-menu-closing');
      })

      // 移除激活状态的样式
      .parent('.mdui-menu-item')
      .removeClass('mdui-menu-item-active');

    // 循环关闭嵌套的子菜单
    $submenu.find('.mdui-menu').each(function () {
      var $subSubmenu = $(this);
      $subSubmenu
        .removeClass('mdui-menu-open')
        .addClass('mdui-menu-closing')
        .transitionEnd(function () {
          $subSubmenu.removeClass('mdui-menu-closing');
        })
        .parent('.mdui-menu-item')
        .removeClass('mdui-menu-item-active');
    });
  };

  /**
   * 切换子菜单状态
   * @param $submenu
   */
  var toggleSubMenu = function ($submenu) {
    if ($submenu.hasClass('mdui-menu-open')) {
      closeSubMenu($submenu);
    } else {
      openSubMenu($submenu);
    }
  };

  /**
   * 绑定子菜单事件
   * @param inst 实例
   */
  var bindSubMenuEvent = function (inst) {
    // 点击打开子菜单
    inst.$menu.on('click', '.mdui-menu-item', function (e) {
      var $this = $(this);
      var $target = $(e.target);

      // 禁用状态菜单不操作
      if ($this.attr('disabled') !== null) {
        return;
      }

      // 没有点击在子菜单的菜单项上时，不操作（点在了子菜单的空白区域、或分隔线上）
      if ($target.is('.mdui-menu') || $target.is('.mdui-divider')) {
        return;
      }

      // 阻止冒泡，点击菜单项时只在最后一级的 mdui-menu-item 上生效，不向上冒泡
      if (!$target.parents('.mdui-menu-item').eq(0).is($this)) {
        return;
      }

      // 当前菜单的子菜单
      var $submenu = $this.children('.mdui-menu');

      // 先关闭除当前子菜单外的所有同级子菜单
      $this.parent('.mdui-menu').children('.mdui-menu-item').each(function () {
        var $tmpSubmenu = $(this).children('.mdui-menu');
        if (
          $tmpSubmenu.length &&
          (!$submenu.length || !$tmpSubmenu.is($submenu))
        ) {
          closeSubMenu($tmpSubmenu);
        }
      });

      // 切换当前子菜单
      if ($submenu.length) {
        toggleSubMenu($submenu);
      }
    });

    if (inst.options.subMenuTrigger === 'hover') {
      // 临时存储 setTimeout 对象
      var timeout;

      var timeoutOpen;
      var timeoutClose;

      inst.$menu.on('mouseover mouseout', '.mdui-menu-item', function (e) {
        var $this = $(this);
        var eventType = e.type;
        var $relatedTarget = $(e.relatedTarget);

        // 禁用状态的菜单不操作
        if ($this.attr('disabled') !== null) {
          return;
        }

        // 用 mouseover 模拟 mouseenter
        if (eventType === 'mouseover') {
          if (!$this.is($relatedTarget) && $.contains($this[0], $relatedTarget[0])) {
            return;
          }
        }

        // 用 mouseout 模拟 mouseleave
        else if (eventType === 'mouseout') {
          if ($this.is($relatedTarget) || $.contains($this[0], $relatedTarget[0])) {
            return;
          }
        }

        // 当前菜单项下的子菜单，未必存在
        var $submenu = $this.children('.mdui-menu');

        // 鼠标移入菜单项时，显示菜单项下的子菜单
        if (eventType === 'mouseover') {
          if ($submenu.length) {

            // 当前子菜单准备打开时，如果当前子菜单正准备着关闭，不用再关闭了
            var tmpClose = $submenu.data('timeoutClose.mdui.menu');
            if (tmpClose) {
              clearTimeout(tmpClose);
            }

            // 如果当前子菜单已经打开，不操作
            if ($submenu.hasClass('mdui-menu-open')) {
              return;
            }

            // 当前子菜单准备打开时，其他准备打开的子菜单不用再打开了
            clearTimeout(timeoutOpen);

            // 准备打开当前子菜单
            timeout = timeoutOpen = setTimeout(function () {
              openSubMenu($submenu);
            }, inst.options.subMenuDelay);

            $submenu.data('timeoutOpen.mdui.menu', timeout);
          }
        }

        // 鼠标移出菜单项时，关闭菜单项下的子菜单
        else if (eventType === 'mouseout') {
          if ($submenu.length) {

            // 鼠标移出菜单项时，如果当前菜单项下的子菜单正准备打开，不用再打开了
            var tmpOpen = $submenu.data('timeoutOpen.mdui.menu');
            if (tmpOpen) {
              clearTimeout(tmpOpen);
            }

            // 准备关闭当前子菜单
            timeout = timeoutClose = setTimeout(function () {
              closeSubMenu($submenu);
            }, inst.options.subMenuDelay);

            $submenu.data('timeoutClose.mdui.menu', timeout);
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
    _this.$anchor = $(anchorSelector).eq(0);
    if (!_this.$anchor.length) {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = _this.$anchor.data('mdui.menu');
    if (oldInst) {
      return oldInst;
    }

    _this.$menu = $(menuSelector).eq(0);

    // 触发菜单的元素 和 菜单必须是同级的元素，否则菜单可能不能定位
    if (!_this.$anchor.siblings(_this.$menu).length) {
      return;
    }

    _this.options = $.extend({}, DEFAULT, (opts || {}));
    _this.state = 'closed';

    // 是否是级联菜单
    _this.isCascade = _this.$menu.hasClass('mdui-menu-cascade');

    // covered 参数处理
    if (_this.options.covered === 'auto') {
      _this.isCovered = !_this.isCascade;
    } else {
      _this.isCovered = _this.options.covered;
    }

    // 点击触发菜单切换
    _this.$anchor.on('click', function () {
      _this.toggle();
    });

    // 点击菜单外面区域关闭菜单
    $document.on('click touchstart', function (e) {
      var $target = $(e.target);
      if (
        (_this.state === 'opening' || _this.state === 'opened') &&
          !$target.is(_this.$menu) &&
          !$.contains(_this.$menu[0], $target[0]) &&
          !$target.is(_this.$anchor) &&
          !$.contains(_this.$anchor[0], $target[0])
      ) {
        _this.close();
      }
    });

    // 点击不含子菜单的菜单条目关闭菜单
    $document.on('click', '.mdui-menu-item', function (e) {
      var $this = $(this);
      if (!$this.find('.mdui-menu').length && $this.attr('disabled') === null) {
        _this.close();
      }
    });

    // 绑定点击或鼠标移入含子菜单的条目的事件
    bindSubMenuEvent(_this);

    // 窗口大小变化时，重新调整菜单位置
    $window.on('resize', $.throttle(function () {
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
   * 动画结束回调
   * @param inst
   */
  var transitionEnd = function (inst) {
    inst.$menu.removeClass('mdui-menu-closing');

    if (inst.state === 'opening') {
      inst.state = 'opened';
      componentEvent('opened', 'menu', inst, inst.$menu);
    }

    if (inst.state === 'closing') {
      inst.state = 'closed';
      componentEvent('closed', 'menu', inst, inst.$menu);

      // 关闭后，恢复菜单样式到默认状态，并恢复 fixed 定位
      inst.$menu.css({
        top: '',
        left: '',
        width: '',
        position: 'fixed',
      });
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
    componentEvent('open', 'menu', _this, _this.$menu);

    // 调整菜单位置
    readjust(_this);

    _this.$menu

      // 菜单隐藏状态使用使用 fixed 定位。
      .css('position', _this.options.fixed ? 'fixed' : 'absolute')

      // 打开菜单
      .addClass('mdui-menu-open')

      // 打开动画完成后
      .transitionEnd(function () {
        transitionEnd(_this);
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

    _this.state = 'closing';
    componentEvent('close', 'menu', _this, _this.$menu);

    // 菜单开始关闭时，关闭所有子菜单
    _this.$menu.find('.mdui-menu').each(function () {
      closeSubMenu($(this));
    });

    _this.$menu
      .removeClass('mdui-menu-open')
      .addClass('mdui-menu-closing')
      .transitionEnd(function () {
        transitionEnd(_this);
      });
  };

  return Menu;
})();

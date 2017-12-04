/**
 * =============================================================================
 * ************   Select 下拉选择   ************
 * =============================================================================
 */

mdui.Select = (function () {

  /**
   * 默认参数
   */
  var DEFAULT = {
    position: 'auto',                // 下拉框位置，auto、bottom、top
    gutter: 16,                      // 菜单与窗口上下边框至少保持多少间距
  };

  /**
   * 调整菜单位置
   * @param _this Select 实例
   */
  var readjustMenu = function (_this) {
    // 窗口高度
    var windowHeight = $window.height();

    // 配置参数
    var gutter = _this.options.gutter;
    var position = _this.options.position;

    // mdui-select 高度
    var selectHeight = parseInt(_this.$select.height());

    // 菜单项高度
    var $menuItemFirst = _this.$items.eq(0);
    var menuItemHeight = parseInt($menuItemFirst.height());
    var menuItemMargin = parseInt($menuItemFirst.css('margin-top'));

    // 菜单高度
    var menuWidth = parseFloat(_this.$select.width() + 0.01); // 必须比真实宽度多一点，不然会出现省略号
    var menuHeight = menuItemHeight * _this.size + menuItemMargin * 2;

    // var menuRealHeight = menuItemHeight * _this.$items.length + menuItemMargin * 2;

    // 菜单是否出现了滚动条
    //var isMenuScrollable = menuRealHeight > menuHeight;

    // select 在窗口中的位置
    var selectTop = _this.$select[0].getBoundingClientRect().top;

    var transformOriginY;
    var menuMarginTop;

    // position 为 auto 时
    if (position === 'auto') {

      // 菜单高度不能超过窗口高度
      var heightTemp = windowHeight - gutter * 2;
      if (menuHeight > heightTemp) {
        menuHeight = heightTemp;
      }

      // 菜单的 margin-top
      menuMarginTop = -(
        menuItemMargin + _this.selectedIndex * menuItemHeight +
        (menuItemHeight - selectHeight) / 2
      );
      var menuMarginTopMax = -(
        menuItemMargin + (_this.size - 1) * menuItemHeight +
        (menuItemHeight - selectHeight) / 2
      );
      if (menuMarginTop < menuMarginTopMax) {
        menuMarginTop = menuMarginTopMax;
      }

      // 菜单不能超出窗口
      var menuTop = selectTop + menuMarginTop;

      if (menuTop < gutter) {
        // 不能超出窗口上方
        menuMarginTop = -(selectTop - gutter);
      } else if (menuTop + menuHeight + gutter > windowHeight) {
        // 不能超出窗口下方
        menuMarginTop = -(selectTop + menuHeight + gutter - windowHeight);
      }

      // transform 的 Y 轴坐标
      transformOriginY = (_this.selectedIndex * menuItemHeight + menuItemHeight / 2 + menuItemMargin) + 'px';
    } else if (position === 'bottom') {
      menuMarginTop = selectHeight;
      transformOriginY = '0px';
    } else if (position === 'top') {
      menuMarginTop = -menuHeight - 1;
      transformOriginY = '100%';
    }

    // 设置样式
    _this.$select.width(menuWidth);
    _this.$menu
      .width(menuWidth)
      .height(menuHeight)
      .css({
        'margin-top': menuMarginTop + 'px',
        'transform-origin':
        'center ' + transformOriginY + ' 0',
      });
  };

  /**
   * 下拉选择
   * @param selector
   * @param opts
   * @constructor
   */
  function Select(selector, opts) {
    var _this = this;

    var $selectNative =  _this.$selectNative = $(selector).eq(0);
    if (!$selectNative.length) {
      return;
    }

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $selectNative.data('mdui.select');
    if (oldInst) {
      return oldInst;
    }

    $selectNative.hide();

    _this.options = $.extend({}, DEFAULT, (opts || {}));

    // 为当前 select 生成唯一 ID
    _this.uniqueID = $.guid('select');

    _this.state = 'closed';

    // 生成 select
    _this.handleUpdate();

    // 点击 select 外面区域关闭
    $document.on('click touchstart', function (e) {
      var $target = $(e.target);
      if (
        (_this.state === 'opening' || _this.state === 'opened') &&
        !$target.is(_this.$select) &&
        !$.contains(_this.$select[0], $target[0])
      ) {
        _this.close();
      }
    });
  }

  /**
   * 对原生 select 组件进行了修改后，需要调用该方法
   */
  Select.prototype.handleUpdate = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    }

    var $selectNative = _this.$selectNative;

    // 当前的值和文本
    _this.value = $selectNative.val();
    _this.text = '';

    // 生成 HTML
    // 菜单项
    _this.$items = $();
    $selectNative.find('option').each(function (index, option) {
      var data = {
        value: option.value,
        text: option.textContent,
        disabled: option.disabled,
        selected: _this.value === option.value,
        index: index,
      };

      if (_this.value === data.value) {
        _this.text = data.text;
        _this.selectedIndex = index;
      }

      _this.$items = _this.$items.add(
        $('<div class="mdui-select-menu-item mdui-ripple"' +
          (data.disabled ? ' disabled' : '') +
          (data.selected ? ' selected' : '') + '>' + data.text + '</div>')
          .data(data)
      );
    });

    // selected
    _this.$selected = $('<span class="mdui-select-selected">' + _this.text + '</span>');

    // select
    _this.$select =
      $(
        '<div class="mdui-select mdui-select-position-' + _this.options.position + '" ' +
        'style="' + _this.$selectNative.attr('style') + '" ' +
        'id="' + _this.uniqueID + '"></div>'
      )
        .show()
        .append(_this.$selected);

    // menu
    _this.$menu =
      $('<div class="mdui-select-menu"></div>')
        .appendTo(_this.$select)
        .append(_this.$items);

    $('#' + _this.uniqueID).remove();
    $selectNative.after(_this.$select);

    // 根据 select 的 size 属性设置高度，默认为 6
    _this.size = _this.$selectNative.attr('size');

    if (!_this.size) {
      _this.size = _this.$items.length;
      if (_this.size > 8) {
        _this.size = 8;
      }
    }

    if (_this.size < 2) {
      _this.size = 2;
    }

    // 点击选项时关闭下拉菜单
    _this.$items.on('click', function () {
      if (_this.state === 'closing') {
        return;
      }

      var $item = $(this);

      if ($item.data('disabled')) {
        return;
      }

      var itemData = $item.data();

      _this.$selected.text(itemData.text);
      $selectNative.val(itemData.value);
      _this.$items.removeAttr('selected');
      $item.attr('selected', '');
      _this.selectedIndex = itemData.index;
      _this.value = itemData.value;
      _this.text = itemData.text;
      $selectNative.trigger('change');

      _this.close();
    });

    // 点击 select 时打开下拉菜单
    _this.$select.on('click', function (e) {
      var $target = $(e.target);

      // 在菜单上点击时不打开
      if ($target.is('.mdui-select-menu') || $target.is('.mdui-select-menu-item')) {
        return;
      }

      _this.toggle();
    });
  };

  /**
   * 动画结束回调
   * @param inst
   */
  var transitionEnd = function (inst) {
    inst.$select.removeClass('mdui-select-closing');

    if (inst.state === 'opening') {
      inst.state = 'opened';
      componentEvent('opened', 'select', inst, inst.$selectNative);

      inst.$menu.css('overflow-y', 'auto');
    }

    if (inst.state === 'closing') {
      inst.state = 'closed';
      componentEvent('closed', 'select', inst, inst.$selectNative);

      // 恢复样式
      inst.$select.width('');
      inst.$menu.css({
        'margin-top': '',
        height: '',
        width: '',
      });
    }
  };

  /**
   * 打开 Select
   */
  Select.prototype.open = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      return;
    }

    _this.state = 'opening';
    componentEvent('open', 'select', _this, _this.$selectNative);

    readjustMenu(_this);

    _this.$select.addClass('mdui-select-open');

    _this.$menu.transitionEnd(function () {
      transitionEnd(_this);
    });
  };

  /**
   * 关闭 Select
   */
  Select.prototype.close = function () {
    var _this = this;

    if (_this.state === 'closing' || _this.state === 'closed') {
      return;
    }

    _this.state = 'closing';
    componentEvent('close', 'select', _this, _this.$selectNative);

    _this.$menu.css('overflow-y', '');

    _this.$select
      .removeClass('mdui-select-open')
      .addClass('mdui-select-closing');
    _this.$menu.transitionEnd(function () {
      transitionEnd(_this);
    });
  };

  /**
   * 切换 Select 显示状态
   */
  Select.prototype.toggle = function () {
    var _this = this;

    if (_this.state === 'opening' || _this.state === 'opened') {
      _this.close();
    } else if (_this.state === 'closing' || _this.state === 'closed') {
      _this.open();
    }
  };

  return Select;
})();

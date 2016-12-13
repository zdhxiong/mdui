/**
 * =============================================================================
 * ************   List 列表   ************
 * =============================================================================
 */

(function () {

  /**
   * 关闭子列表
   */
  var closeSubList = function () {

  };

  /**
   * 打开子列表
   */
  var openSubList = function () {

  };

  $.on(document, 'click', '.mdui-list-sub>.mdui-list-item', function () {
    var _this = this;
    var list = $.parent(_this, '.mdui-list-sub');
    var sublist = $.child(list, '.mdui-list');

    var itemHeight = parseFloat($.getStyle(_this, 'height'));
    list.style.height = $.getStyle(list, 'height');
    $.getStyle(list, 'height');

    // 是否手风琴效果
    // var accordion = $.parent(list, '.mdui-list').classList.contains('mdui-list-sub-accordion');

    if (list.classList.contains('mdui-list-sub-open')) {
      // 关闭子菜单
      $.pluginEvent('close', 'sublist', null, list);

      list.style.height = itemHeight + 'px';

      $.transitionEnd(list, function () {
        list.classList.remove('mdui-list-sub-open');
        $.pluginEvent('closed', 'sublist', null, list);
      });
    } else {
      // 打开子菜单

      $.pluginEvent('open', 'sublist', null, list);

      list.style.height = (parseFloat($.getStyle(sublist, 'height')) + itemHeight) + 'px';
      list.classList.add('mdui-list-sub-open');

      $.transitionEnd(list, function () {
        $.pluginEvent('opened', 'sublist', null, list);
      });
    }
  });
})();

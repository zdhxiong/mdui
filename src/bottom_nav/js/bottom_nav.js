/**
 * =============================================================================
 * ************   Bottom navigation 底部导航栏   ************
 * =============================================================================
 */

(function () {

  $.on(document, 'click', '.mdui-bottom-nav>a', function () {
    var _this = this;
    var bottomNav = $.parent(_this, '.mdui-bottom-nav');
    var items = $.children(bottomNav, 'a');

    $.each(items, function (i, curItem) {
      if (_this === curItem) {
        $.pluginEvent('change', 'bottomNav', null, bottomNav, {
          index: i,
        });

        curItem.classList.add('mdui-bottom-nav-active');
      } else {
        curItem.classList.remove('mdui-bottom-nav-active');
      }
    });
  });

})();

/**
 * =============================================================================
 * ************   Bottom navigation 底部导航栏   ************
 * =============================================================================
 */

(function () {

  // 切换导航项
  $document.on('click', '.mdui-bottom-nav>a', function () {
    var $this = $(this);
    var $bottomNav = $this.parent();
    var isThis;
    $bottomNav.children('a').each(function (i, item) {
      isThis = $this.is(item);
      if (isThis) {
        componentEvent('change', 'bottomNav', null, $bottomNav, {
          index: i,
        });
      }

      $(item)[isThis ? 'addClass' : 'removeClass']('mdui-bottom-nav-active');
    });
  });

  // 滚动时隐藏 mdui-bottom-nav-scroll-hide
  $('.mdui-bottom-nav-scroll-hide').each(function () {
    var $this = $(this);
    var inst = new mdui.Headroom($this, {
      pinnedClass: 'mdui-headroom-pinned-down',
      unpinnedClass: 'mdui-headroom-unpinned-down',
    });
    $this.data('mdui.headroom', inst);
  });

})();

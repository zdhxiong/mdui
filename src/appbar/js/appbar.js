/**
 * =============================================================================
 * ************   Appbar   ************
 * =============================================================================
 * 滚动时自动隐藏应用栏
 * mdui-appbar-scroll-hide
 * mdui-appbar-scroll-toolbar-hide
 */

$(function () {
  // 滚动时隐藏应用栏
  $('.mdui-appbar-scroll-hide').each(function () {
    var $this = $(this);
    $this.data('mdui.headroom', new mdui.Headroom($this));
  });

  // 滚动时只隐藏应用栏中的工具栏
  $('.mdui-appbar-scroll-toolbar-hide').each(function () {
    var $this = $(this);
    var inst = new mdui.Headroom($this, {
      pinnedClass: 'mdui-headroom-pinned-toolbar',
      unpinnedClass: 'mdui-headroom-unpinned-toolbar',
    });
    $this.data('mdui.headroom', inst);
  });
});

/**
 * =============================================================================
 * ************   Appbar   ************
 * =============================================================================
 * 滚动时自动隐藏应用栏
 * mdui-appbar-scroll-hide
 * mdui-appbar-scroll-toolbar-hide
 */

$.ready(function () {

  // 滚动时隐藏应用栏
  $.each($.queryAll('.mdui-appbar-scroll-hide'), function (i, appbar) {
    $.data(appbar, 'mdui.headroom', new mdui.Headroom(appbar));
  });

  // 滚动时只隐藏应用栏中的工具栏
  $.each($.queryAll('.mdui-appbar-scroll-toolbar-hide'), function (i, appbar) {
    var inst = new mdui.Headroom('.mdui-appbar-scroll-toolbar-hide', {
      pinnedClass: 'mdui-headroom-pinned-toolbar',
      unpinnedClass: 'mdui-headroom-unpinned-toolbar',
    });
    $.data(appbar, 'mdui.headroom', inst);
  });
});

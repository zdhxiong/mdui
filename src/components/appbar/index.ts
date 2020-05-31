import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import '../../global/mutation';
import '../headroom';

$(() => {
  // 滚动时隐藏应用栏
  mdui.mutation('.mdui-appbar-scroll-hide', function () {
    new mdui.Headroom(this);
  });

  // 滚动时只隐藏应用栏中的工具栏
  mdui.mutation('.mdui-appbar-scroll-toolbar-hide', function () {
    new mdui.Headroom(this, {
      pinnedClass: 'mdui-headroom-pinned-toolbar',
      unpinnedClass: 'mdui-headroom-unpinned-toolbar',
    });
  });
});

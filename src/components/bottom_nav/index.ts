import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/removeClass';
import mdui from '../../mdui';
import '../../global/mutation';
import { componentEvent } from '../../utils/componentEvent';
import { $document } from '../../utils/dom';
import '../headroom';

$(() => {
  // 切换导航项
  $document.on('click', '.mdui-bottom-nav>a', function () {
    const $item = $(this as HTMLElement);
    const $bottomNav = $item.parent();

    $bottomNav.children('a').each((index, item) => {
      const isThis = $item.is(item);

      if (isThis) {
        componentEvent('change', 'bottomNav', $bottomNav[0], undefined, {
          index,
        });
      }

      isThis
        ? $(item).addClass('mdui-bottom-nav-active')
        : $(item).removeClass('mdui-bottom-nav-active');
    });
  });

  // 滚动时隐藏 mdui-bottom-nav-scroll-hide
  mdui.mutation('.mdui-bottom-nav-scroll-hide', function () {
    new mdui.Headroom(this, {
      pinnedClass: 'mdui-headroom-pinned-down',
      unpinnedClass: 'mdui-headroom-unpinned-down',
    });
  });
});

import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-fab';

$(() => {
  // mouseenter 不冒泡，无法进行事件委托，这里用 mouseover 代替。
  // 不管是 click 、 mouseover 还是 touchstart ，都先初始化。

  $document.on(
    'touchstart mousedown mouseover',
    `[${customAttr}]`,
    function () {
      new mdui.Fab(
        this as HTMLElement,
        parseOptions(this as HTMLElement, customAttr),
      );
    },
  );
});

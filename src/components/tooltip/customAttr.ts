import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-tooltip';
const dataName = '_mdui_tooltip';

$(() => {
  // mouseenter 不能冒泡，所以这里用 mouseover 代替
  $document.on('touchstart mouseover', `[${customAttr}]`, function () {
    const $target = $(this);
    let instance = $target.data(dataName);

    if (!instance) {
      instance = new mdui.Tooltip(
        this as HTMLElement,
        parseOptions(this as HTMLElement, customAttr),
      );
      $target.data(dataName, instance);
    }
  });
});

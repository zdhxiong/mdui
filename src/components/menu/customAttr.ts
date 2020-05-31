import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-menu';
const dataName = '_mdui_menu';

type OPTIONS = {
  target: string;
  position?: 'auto' | 'top' | 'bottom' | 'center';
  align?: 'auto' | 'left' | 'right' | 'center';
  gutter?: number;
  fixed?: boolean;
  covered?: boolean | 'auto';
  subMenuTrigger?: 'click' | 'hover';
  subMenuDelay?: number;
};

$(() => {
  $document.on('click', `[${customAttr}]`, function () {
    const $this = $(this as HTMLElement);
    let instance = $this.data(dataName);

    if (!instance) {
      const options = parseOptions(this as HTMLElement, customAttr) as OPTIONS;
      const menuSelector = options.target;
      delete options.target;

      instance = new mdui.Menu($this, menuSelector, options);
      $this.data(dataName, instance);

      instance.toggle();
    }
  });
});

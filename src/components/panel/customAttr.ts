import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-panel';

$(() => {
  mdui.mutation(`[${customAttr}]`, function () {
    new mdui.Panel(this, parseOptions(this, customAttr));
  });
});

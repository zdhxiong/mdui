import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-tab';

$(() => {
  mdui.mutation(`[${customAttr}]`, function () {
    new mdui.Tab(this, parseOptions(this, customAttr));
  });
});

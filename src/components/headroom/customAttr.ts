import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-headroom';

$(() => {
  mdui.mutation(`[${customAttr}]`, function () {
    new mdui.Headroom(this, parseOptions(this, customAttr));
  });
});

import $ from 'mdui.jq/es/$';
import mdui from '../../global/mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-collapse';

$(() => {
  mdui.mutation(`[${customAttr}]`, function() {
    new mdui.Collapse(this, parseOptions(this, customAttr));
  });
});

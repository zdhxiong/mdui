import $ from 'mdui.jq/es/$';
import mdui from '../../mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';

const customAttr = 'mdui-select';

$(() => {
  mdui.mutation(`[${customAttr}]`, function () {
    new mdui.Select(this, parseOptions(this, customAttr));
  });
});

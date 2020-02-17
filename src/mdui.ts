import { MduiStatic } from './interfaces/MduiStatic';
import $ from 'mdui.jq/es/$';
import { $body } from './utils/dom';

// 避免页面加载完后直接执行css动画
// https://css-tricks.com/transitions-only-after-page-load/
setTimeout(() => $body.addClass('mdui-loaded'));

const mdui = {
  $: $,
} as MduiStatic;

export default mdui;

import $ from 'mdui.jq/es/$';
import each from 'mdui.jq/es/functions/each';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import { Dialog } from './class';
import './index';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 打开一个对话框，标题、内容、按钮等都可以自定义
     * @param options 配置参数
     */
    dialog(options: OPTIONS): Dialog;
  }
}

type BUTTON = {
  /**
   * 按钮文本
   */
  text?: string;

  /**
   * 按钮文本是否加粗，默认为 `false`
   */
  bold?: boolean;

  /**
   * 点击按钮后是否关闭对话框，默认为 `true`
   */
  close?: boolean;

  /**
   * 点击按钮的回调函数，参数为对话框的实例
   */
  onClick?: (dialog: Dialog) => void;
};

type OPTIONS = {
  /**
   * 对话框的标题
   */
  title?: string;

  /**
   * 对话框的内容
   */
  content?: string;

  /**
   * 按钮数组，每个按钮都是一个带按钮参数的对象
   */
  buttons?: BUTTON[];

  /**
   * 按钮是否垂直排列，默认为 `false`
   */
  stackedButtons?: boolean;

  /**
   * 添加到 `.mdui-dialog` 上的 CSS 类
   */
  cssClass?: string;

  /**
   * 是否监听 `hashchange` 事件，为 `true` 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框，默认为 `true`
   */
  history?: boolean;

  /**
   * 打开对话框后是否显示遮罩层，默认为 `true`
   */
  overlay?: boolean;

  /**
   * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭
   */
  modal?: boolean;

  /**
   * 按下 Esc 键时是否关闭对话框，默认为 `true`
   */
  closeOnEsc?: boolean;

  /**
   * 关闭对话框后是否自动销毁对话框，默认为 `true`
   */
  destroyOnClosed?: boolean;

  /**
   * 打开动画开始时的回调，参数为对话框实例
   */
  onOpen?: (dialog: Dialog) => void;

  /**
   * 打开动画结束时的回调，参数为对话框实例
   */
  onOpened?: (dialog: Dialog) => void;

  /**
   * 关闭动画开始时的回调，参数为对话框实例
   */
  onClose?: (dialog: Dialog) => void;

  /**
   * 关闭动画结束时的回调，参数为对话框实例
   */
  onClosed?: (dialog: Dialog) => void;
};

const DEFAULT_BUTTON: BUTTON = {
  text: '',
  bold: false,
  close: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
};

const DEFAULT_OPTIONS: OPTIONS = {
  title: '',
  content: '',
  buttons: [],
  stackedButtons: false,
  cssClass: '',
  history: true,
  overlay: true,
  modal: false,
  closeOnEsc: true,
  destroyOnClosed: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOpen: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOpened: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClosed: () => {},
};

mdui.dialog = function (options: OPTIONS): Dialog {
  // 合并配置参数
  options = extend({}, DEFAULT_OPTIONS, options);

  each(options.buttons!, (i, button) => {
    options.buttons![i] = extend({}, DEFAULT_BUTTON, button);
  });

  // 按钮的 HTML
  let buttonsHTML = '';
  if (options.buttons?.length) {
    buttonsHTML = `<div class="mdui-dialog-actions${
      options.stackedButtons ? ' mdui-dialog-actions-stacked' : ''
    }">`;

    each(options.buttons, (_, button) => {
      buttonsHTML +=
        '<a href="javascript:void(0)" ' +
        `class="mdui-btn mdui-ripple mdui-text-color-primary ${
          button.bold ? 'mdui-btn-bold' : ''
        }">${button.text}</a>`;
    });

    buttonsHTML += '</div>';
  }

  // Dialog 的 HTML
  const HTML =
    `<div class="mdui-dialog ${options.cssClass}">` +
    (options.title
      ? `<div class="mdui-dialog-title">${options.title}</div>`
      : '') +
    (options.content
      ? `<div class="mdui-dialog-content">${options.content}</div>`
      : '') +
    buttonsHTML +
    '</div>';

  // 实例化 Dialog
  const instance = new mdui.Dialog(HTML, {
    history: options.history,
    overlay: options.overlay,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
    destroyOnClosed: options.destroyOnClosed,
  });

  // 绑定按钮事件
  if (options.buttons?.length) {
    instance.$element
      .find('.mdui-dialog-actions .mdui-btn')
      .each((index, button) => {
        $(button).on('click', () => {
          options.buttons![index].onClick!(instance);

          if (options.buttons![index].close) {
            instance.close();
          }
        });
      });
  }

  // 绑定打开关闭事件
  instance.$element
    .on('open.mdui.dialog', () => {
      options.onOpen!(instance);
    })
    .on('opened.mdui.dialog', () => {
      options.onOpened!(instance);
    })
    .on('close.mdui.dialog', () => {
      options.onClose!(instance);
    })
    .on('closed.mdui.dialog', () => {
      options.onClosed!(instance);
    });

  instance.open();

  return instance;
};

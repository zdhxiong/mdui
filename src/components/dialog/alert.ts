import extend from 'mdui.jq/es/functions/extend';
import { isFunction, isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import { Dialog } from './class';
import './dialog';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 打开一个警告框，可以包含标题、内容和一个确认按钮
     * @param text 警告框内容
     * @param title 警告框标题
     * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
     * @param options 配置参数
     */
    alert(
      text: string,
      title: string,
      onConfirm?: (dialog: Dialog) => void,
      options?: OPTIONS,
    ): Dialog;

    /**
     * 打开一个警告框，可以包含内容，和一个确认按钮
     * @param text 警告框内容
     * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
     * @param options 配置参数
     */
    alert(
      text: string,
      onConfirm?: (dialog: Dialog) => void,
      options?: OPTIONS,
    ): Dialog;
  }
}

type OPTIONS = {
  /**
   * 确认按钮的文本
   */
  confirmText?: string;

  /**
   * 是否监听 hashchange 事件，为 `true` 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框，默认为 `true`
   */
  history?: boolean;

  /**
   * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭，默认为 `false`
   */
  modal?: boolean;

  /**
   * 按下 Esc 键时是否关闭对话框，默认为 `true`
   */
  closeOnEsc?: boolean;

  /**
   * 是否在按下确认按钮时是否关闭对话框
   */
  closeOnConfirm?: boolean;
};

const DEFAULT_OPTIONS: OPTIONS = {
  confirmText: 'ok',
  history: true,
  modal: false,
  closeOnEsc: true,
  closeOnConfirm: true,
};

mdui.alert = function (
  text: string,
  title?: any,
  onConfirm?: any,
  options?: any,
): Dialog {
  if (isFunction(title)) {
    options = onConfirm;
    onConfirm = title;
    title = '';
  }

  if (isUndefined(onConfirm)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm = (): void => {};
  }

  if (isUndefined(options)) {
    options = {};
  }

  options = extend({}, DEFAULT_OPTIONS, options);

  return mdui.dialog({
    title: title,
    content: text,
    buttons: [
      {
        text: options.confirmText,
        bold: false,
        close: options.closeOnConfirm,
        onClick: onConfirm,
      },
    ],
    cssClass: 'mdui-dialog-alert',
    history: options.history,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
  });
};

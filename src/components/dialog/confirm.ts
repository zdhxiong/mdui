import extend from 'mdui.jq/es/functions/extend';
import { isFunction, isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import { Dialog } from './class';
import './dialog';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 打开一个确认框，可以包含标题、内容、一个确认按钮和一个取消按钮
     * @param text 确认框内容
     * @param title 确认框标题
     * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
     * @param onCancel 点击取消按钮的回调函数，参数为对话框实例
     * @param options 配置参数
     */
    confirm(
      text: string,
      title: string,
      onConfirm?: (dialog: Dialog) => void,
      onCancel?: (dialog: Dialog) => void,
      options?: OPTIONS,
    ): Dialog;

    /**
     * 打开一个确认框，可以包含内容、一个确认按钮和一个取消按钮
     * @param text 确认框内容
     * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
     * @param onCancel 点击取消按钮的回调函数，参数为对话框实例
     * @param options 配置参数
     */
    confirm(
      text: string,
      onConfirm?: (dialog: Dialog) => void,
      onCancel?: (dialog: Dialog) => void,
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
   * 取消按钮的文本
   */
  cancelText?: string;

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
   * 是否在按下取消按钮时是否关闭对话框
   */
  closeOnCancel?: boolean;

  /**
   * 是否在按下确认按钮时是否关闭对话框
   */
  closeOnConfirm?: boolean;
};

const DEFAULT_OPTIONS: OPTIONS = {
  confirmText: 'ok',
  cancelText: 'cancel',
  history: true,
  modal: false,
  closeOnEsc: true,
  closeOnCancel: true,
  closeOnConfirm: true,
};

mdui.confirm = function (
  text: string,
  title?: any,
  onConfirm?: any,
  onCancel?: any,
  options?: any,
): Dialog {
  if (isFunction(title)) {
    options = onCancel;
    onCancel = onConfirm;
    onConfirm = title;
    title = '';
  }

  if (isUndefined(onConfirm)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConfirm = (): void => {};
  }

  if (isUndefined(onCancel)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel = (): void => {};
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
        text: options.cancelText,
        bold: false,
        close: options.closeOnCancel,
        onClick: onCancel,
      },
      {
        text: options.confirmText,
        bold: false,
        close: options.closeOnConfirm,
        onClick: onConfirm,
      },
    ],
    cssClass: 'mdui-dialog-confirm',
    history: options.history,
    modal: options.modal,
    closeOnEsc: options.closeOnEsc,
  });
};

import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import { toKebabCase } from '@mdui/jq/shared/helper.js';
import { dequeue, queue } from '@mdui/shared/helpers/queue.js';
import { Snackbar } from '@mdui/components/snackbar.js';

interface Options {
  /**
   * Snackbar 中的消息文本内容
   */
  message: string;

  /**
   * Snackbar 出现的位置。可选值为：
   * * `top`：位于顶部，居中对齐
   * * `top-start`：位于顶部，左对齐
   * * `top-end`：位于顶部，右对齐
   * * `bottom`：位于底部，居中对齐
   * * `bottom-start`：位于底部，左对齐
   * * `bottom-end`：位于底部，右对齐
   */
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end';

  /**
   * 操作按钮的文本
   */
  action?: string;

  /**
   * 是否在右侧显示关闭按钮
   */
  closeable?: boolean;

  /**
   * 消息文本最多显示几行。默认不限制行数。可选值为
   * * `1`：消息文本最多显示一行
   * * `2`：消息文本最多显示两行
   */
  messageLine?: number;

  /**
   * 在多长时间后自动关闭（单位为毫秒）。设置为 0 时，不自动关闭
   */
  autoCloseDelay?: number;

  /**
   * 点击操作按钮时是否关闭 Snackbar
   */
  closeOnActionClick?: boolean;

  /**
   * 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar
   */
  closeOnOutsideClick?: boolean;

  /**
   * 点击 Snackbar 时的回调函数
   * @param snackbar
   */
  onClick?: (snackbar: Snackbar) => void;

  /**
   * 点击操作按钮时的回调函数
   * @param snackbar
   */
  onActionClick?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 开始显示时的回调函数
   * @param snackbar
   */
  onOpen?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 显示动画完成时的回调函数
   * @param snackbar
   */
  onOpened?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 开始隐藏时的回调函数
   * @param snackbar
   */
  onClose?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 隐藏动画完成时的回调函数
   * @param snackbar
   */
  onClosed?: (snackbar: Snackbar) => void;
}

const queueName = 'mdui.functions.snackbar';
let currentSnackbar: Snackbar | undefined = undefined;

/**
 * 打开一个 Snackbar
 * @param options
 */
export const snackbar = (options: Options): Snackbar => {
  const snackbar = new Snackbar();
  const $snackbar = $(snackbar);

  Object.entries(options).forEach(([key, value]) => {
    if (key === 'message') {
      snackbar.innerHTML = value as string;
    } else if (
      [
        'onClick',
        'onActionClick',
        'onOpen',
        'onOpened',
        'onClose',
        'onClosed',
      ].includes(key)
    ) {
      const eventName = toKebabCase(key.slice(2));

      $snackbar.on(eventName, () => {
        value(snackbar);
      });
    } else {
      // @ts-ignore
      snackbar[key] = value;
    }
  });

  $snackbar.on('closed', () => {
    $snackbar.remove();
    currentSnackbar = undefined;
    dequeue(queueName);
  });

  $snackbar.appendTo('body');

  if (currentSnackbar) {
    queue(queueName, () => {
      snackbar.open = true;
      currentSnackbar = snackbar;
    });
  } else {
    setTimeout(() => {
      snackbar.open = true;
    });
    currentSnackbar = snackbar;
  }

  return snackbar;
};

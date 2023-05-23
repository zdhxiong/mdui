import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import { returnTrue, toKebabCase } from '@mdui/jq/shared/helper.js';
import { dequeue, queue } from '@mdui/shared/helpers/queue.js';
import '@mdui/components/button.js';
import { Dialog } from '@mdui/components/dialog.js';
import type { Button } from '@mdui/components/button.js';
import type { JQ } from '@mdui/jq/shared/core.js';

interface Action {
  /**
   * 按钮文本
   */
  text: string;

  /**
   * 点击按钮时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * 默认点击按钮后会关闭 dialog；若返回值为 false，则不关闭 dialog；若返回值为 promise，则将在 promise 被 resolve 后，关闭 dialog
   * @param dialog
   */
  onClick?: (dialog: Dialog) => void | boolean | Promise<void>;
}

interface Options {
  /**
   * dialog 的标题
   */
  headline?: string;

  /**
   * dialog 的描述文本
   */
  description?: string;

  /**
   * dialog 中的 body 内容，可以是 HTML 字符串、或 DOM 元素
   */
  body?: string | HTMLElement | JQ;

  /**
   * dialog 顶部的 Material Icons 图标名
   */
  icon?: string;

  /**
   * 是否在按下 ESC 键时，关闭 dialog
   */
  closeOnEsc?: boolean;

  /**
   * 是否在点击遮罩层时，关闭 dialog
   */
  closeOnOverlayClick?: boolean;

  /**
   * 底部操作按钮数组
   */
  actions?: Action[];

  /**
   * 是否垂直排列底部操作按钮
   */
  stackedActions?: boolean;

  /**
   * 是否启用队列。
   * 默认不启用队列，在多次调用该函数时，将同时显示多个 dialog；启用队列后，将在上一个 dialog 关闭后才打开下一个 dialog。
   * dialog()、alert()、confirm()、prompt() 函数共用同一个队列。
   */
  queue?: boolean;

  /**
   * dialog 开始打开时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpen?: (dialog: Dialog) => void;

  /**
   * dialog 打开动画完成时的回调函数
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpened?: (dialog: Dialog) => void;

  /**
   * dialog 开始关闭时的回调函数
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onClose?: (dialog: Dialog) => void;

  /**
   * dialog 关闭动画完成时的回调函数
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onClosed?: (dialog: Dialog) => void;

  /**
   * 点击遮罩层时的回调函数
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOverlayClick?: (dialog: Dialog) => void;
}

const defaultAction: Required<Pick<Action, 'onClick'>> = {
  onClick: returnTrue,
};
const queueName = 'mdui.functions.dialog';
let currentDialog: Dialog | undefined = undefined;

/**
 * 打开一个 dialog，返回 dialog 实例
 * @param options
 */
export const dialog = (options: Options): Dialog => {
  const dialog = new Dialog();
  const $dialog = $(dialog);

  const properties: (keyof Pick<
    Options,
    | 'headline'
    | 'description'
    | 'icon'
    | 'closeOnEsc'
    | 'closeOnOverlayClick'
    | 'stackedActions'
  >)[] = [
    'headline',
    'description',
    'icon',
    'closeOnEsc',
    'closeOnOverlayClick',
    'stackedActions',
  ];

  const callbacks: (keyof Pick<
    Options,
    'onOpen' | 'onOpened' | 'onClose' | 'onClosed' | 'onOverlayClick'
  >)[] = ['onOpen', 'onOpened', 'onClose', 'onClosed', 'onOverlayClick'];

  Object.entries(options).forEach(([key, value]) => {
    // @ts-ignore
    if (properties.includes(key)) {
      // @ts-ignore
      dialog[key] = value;
      // @ts-ignore
    } else if (callbacks.includes(key)) {
      const eventName = toKebabCase(key.slice(2));

      $dialog.on(eventName, () => {
        value.call(dialog, dialog);
      });
    }
  });

  if (options.body) {
    $dialog.append(options.body);
  }

  if (options.actions) {
    options.actions.forEach((action) => {
      const mergedAction = Object.assign({}, defaultAction, action);

      $<Button>(`<mdui-button
        slot="action"
        variant="text"
      >${mergedAction.text}</mdui-button>`)
        .appendTo($dialog)
        .on('click', function () {
          const clickResult = mergedAction.onClick.call(dialog, dialog);

          if (isPromise(clickResult)) {
            this.loading = true;
            clickResult
              .then(() => {
                dialog.open = false;
              })
              .finally(() => {
                this.loading = false;
              });
          } else if (clickResult !== false) {
            dialog.open = false;
          }
        });
    });
  }

  $dialog.appendTo('body').on('closed', () => {
    $dialog.remove();

    if (options.queue) {
      currentDialog = undefined;
      dequeue(queueName);
    }
  });

  if (!options.queue) {
    setTimeout(() => {
      dialog.open = true;
    });
  } else if (currentDialog) {
    queue(queueName, () => {
      dialog.open = true;
      currentDialog = dialog;
    });
  } else {
    setTimeout(() => {
      dialog.open = true;
    });
    currentDialog = dialog;
  }

  return dialog;
};

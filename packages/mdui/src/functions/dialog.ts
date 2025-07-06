import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import {
  isUndefined,
  returnTrue,
  toKebabCase,
} from '@mdui/jq/shared/helper.js';
import { dequeue, queue } from '@mdui/shared/helpers/queue.js';
import { Button } from '../components/button.js';
import { Dialog } from '../components/dialog.js';
import type { JQ } from '@mdui/jq/shared/core.js';

interface Action {
  /**
   * 按钮文本
   */
  text: string;

  /**
   * 点击按钮时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * 默认点击按钮后会关闭 dialog；若返回值为 false，则不关闭 dialog；若返回值为 promise，则将在 promise 被 resolve 后，关闭 dialog。
   * @param dialog
   */
  onClick?: (dialog: Dialog) => void | boolean | Promise<void>;

  /**
   * 按钮为 `<mdui-button>` 组件。可在该参数中设置 `<mdui-button>` 组件的属性。
   */
  options?: Partial<Button>;
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
   * dialog 中的 body 内容，可以是 HTML 字符串、DOM 元素、或 JQ 对象
   */
  body?: string | HTMLElement | JQ<HTMLElement>;

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
   * 队列名称。
   * 默认不启用队列，在多次调用该函数时，将同时显示多个 dialog。
   * 可在该参数中传入一个队列名称，具有相同队列名称的 dialog 函数，将在上一个 dialog 关闭后才打开下一个 dialog。
   * `dialog()`、`alert()`、`confirm()`、`prompt()` 这四个函数的队列名称若相同，则也将互相共用同一个队列。
   */
  queue?: string;

  /**
   * dialog 开始打开时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpen?: (dialog: Dialog) => void;

  /**
   * dialog 打开动画完成时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpened?: (dialog: Dialog) => void;

  /**
   * dialog 开始关闭时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onClose?: (dialog: Dialog) => void;

  /**
   * dialog 关闭动画完成时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onClosed?: (dialog: Dialog) => void;

  /**
   * 点击遮罩层时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOverlayClick?: (dialog: Dialog) => void;

  /**
   * dialog 组件的无障碍角色。如果是警告对话框，则需要设置为 'alertdialog'；否则默认为普通对话框 `dialog`。
   */
  accessibleRole?: 'alertdialog' | 'dialog';

  /**
   * 组件的无障碍名称。它将应用到 [`aria-label`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label)，但不会在界面上显示
   */
  accessibleLabel?: string;

  /**
   * 页面中其他元素的 id（或多个 id），组件将使用对应元素的文本作为无障碍名称。等同于 [`aria-labelledby`](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby)
   */
  accessibleLabelledby?: string;

  /**
   * 组件的无障碍描述。它将应用到 [`aria-description`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-description)，但不会在界面上显示
   */
  accessibleDescription?: string;

  /**
   * 页面中其他元素的 id（或多个 id），组件将使用对应元素的文本作为无障碍描述。等同于 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby)
   */
  accessibleDescribedby?: string;
}

type DialogProperties = Pick<
  Options,
  | 'headline'
  | 'description'
  | 'icon'
  | 'closeOnEsc'
  | 'closeOnOverlayClick'
  | 'stackedActions'
  | 'accessibleRole'
  | 'accessibleLabel'
  | 'accessibleLabelledby'
  | 'accessibleDescription'
  | 'accessibleDescribedby'
>;

type DialogCallbacks = Pick<
  Options,
  'onOpen' | 'onOpened' | 'onClose' | 'onClosed' | 'onOverlayClick'
>;

const queueName = 'mdui.functions.dialog.';
let currentDialog: Dialog | undefined = undefined;

/**
 * 打开一个 dialog，返回 dialog 实例
 * @param options
 */
export const dialog = (options: Options): Dialog => {
  const dialog = new Dialog();
  const $dialog = $(dialog);

  const properties: (keyof DialogProperties)[] = [
    'headline',
    'description',
    'icon',
    'closeOnEsc',
    'closeOnOverlayClick',
    'stackedActions',
    'accessibleRole',
    'accessibleLabel',
    'accessibleLabelledby',
    'accessibleDescription',
    'accessibleDescribedby',
  ];

  const callbacks: (keyof DialogCallbacks)[] = [
    'onOpen',
    'onOpened',
    'onClose',
    'onClosed',
    'onOverlayClick',
  ];

  // 赋值 dialog 的属性
  Object.assign(
    dialog,
    Object.fromEntries(
      properties
        .filter((key) => !isUndefined(options[key]))
        .map((key) => [key, options[key]]),
    ),
  );

  // 绑定 dialog 的回调函数
  callbacks
    .filter((key) => !isUndefined(options[key]))
    .forEach((key) => {
      const eventName = toKebabCase(key.slice(2));
      $dialog.on(eventName, (e) => {
        if (e.target === dialog) {
          options[key]!.call(dialog, dialog);
        }
      });
    });

  if (options.body) {
    $dialog.append(options.body);
  }

  if (options.actions) {
    options.actions.forEach((action) => {
      const mergedAction = {
        onClick: returnTrue,
        options: {},
        ...Object.fromEntries(
          Object.entries(action).filter(([, value]) => !isUndefined(value)),
        ),
      } as unknown as Required<Action>;

      const button = new Button();

      Object.assign(button, mergedAction.options);
      button.textContent = mergedAction.text;
      button.slot = 'action';
      if (!mergedAction.options.variant) {
        button.variant = 'text';
      }

      $(button)
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

  $dialog.appendTo('body').on('closed', (e) => {
    if (e.target !== dialog) {
      return;
    }

    $dialog.remove();

    if (options.queue) {
      currentDialog = undefined;
      dequeue(queueName + options.queue);
    }
  });

  if (!options.queue) {
    setTimeout(() => {
      dialog.open = true;
    });
  } else if (currentDialog) {
    queue(queueName + options.queue, () => {
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

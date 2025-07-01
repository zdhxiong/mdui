import { msg } from '@lit/localize';
import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/first.js';
import '@mdui/jq/methods/last.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/text.js';
import {
  isBoolean,
  isString,
  isUndefined,
  returnTrue,
} from '@mdui/jq/shared/helper.js';
import { TextField } from '../components/text-field.js';
import { onLocaleReady, offLocaleReady } from '../internal/localize.js';
import { dialog as openDialog } from './dialog.js';
import type { Dialog } from '../components/dialog.js';

interface Options {
  /**
   * prompt 的标题
   */
  headline?: string;

  /**
   * prompt 的描述文本
   */
  description?: string;

  /**
   * prompt 顶部的 Material Icons 图标名
   */
  icon?: string;

  /**
   * 是否在按下 ESC 键时，关闭 prompt
   */
  closeOnEsc?: boolean;

  /**
   * 是否在点击遮罩层时，关闭 prompt
   */
  closeOnOverlayClick?: boolean;

  /**
   * 确认按钮的文本
   */
  confirmText?: string;

  /**
   * 取消按钮的文本
   */
  cancelText?: string;

  /**
   * 是否垂直排列底部操作按钮
   */
  stackedActions?: boolean;

  /**
   * 队列名称。
   * 默认不启用队列，在多次调用该函数时，将同时显示多个 prompt。
   * 可在该参数中传入一个队列名称，具有相同队列名称的 prompt 函数，将在上一个 prompt 关闭后才打开下一个 prompt。
   * `dialog()`、`alert()`、`confirm()`、`prompt()` 这四个函数的队列名称若相同，则也将互相共用同一个队列。
   */
  queue?: string;

  /**
   * 点击确认按钮时的回调函数。
   * 函数参数为输入框的值和 dialog 实例，`this` 指向 dialog 实例。
   * 默认点击确认按钮后会关闭 prompt；若返回值为 `false`，则不关闭 prompt；若返回值为 promise，则将在 promise 被 resolve 后，关闭 prompt。
   * @param value
   * @param dialog
   */
  onConfirm?: (value: string, dialog: Dialog) => void | boolean | Promise<void>;

  /**
   * 点击取消按钮时的回调函数。
   * 函数参数为输入框的值和 dialog 实例，`this` 指向 dialog 实例。
   * 默认点击取消按钮后会关闭 prompt；若返回值为 `false`，则不关闭 prompt；若返回值为 promise，则将在 promise 被 resolve 后，关闭 prompt。
   * @param dialog
   */
  onCancel?: (value: string, dialog: Dialog) => void | boolean | Promise<void>;

  /**
   * prompt 开始打开时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpen?: (dialog: Dialog) => void;

  /**
   * prompt 打开动画完成时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onOpened?: (dialog: Dialog) => void;

  /**
   * prompt 开始关闭时的回调函数。
   * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
   * @param dialog
   */
  onClose?: (dialog: Dialog) => void;

  /**
   * prompt 关闭动画完成时的回调函数。
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
   * 输入框的校验函数，参数为输入框的值。`this` 指向 TextField 实例。
   * 将在浏览器原生验证 API 验证通过后，再使用该函数进行验证。
   * 可以返回 `boolean` 值，为 `false` 时表示验证未通过，为 `true` 时表示验证通过。
   * 也可以返回字符串，字符串不为空时表示验证未通过，同时返回的字符串将用作错误提示。
   * 也可以返回 Promise，被 resolve 表示验证通过，被 reject 表示验证未通过，同时拒绝原因将用作错误提示。
   * @param value
   */
  validator?: (value: string) => boolean | string | Promise<void>;

  /**
   * prompt 内部的输入框为 `<mdui-text-field>` 组件。可在该参数中设置 `<mdui-text-field>` 组件的参数。
   */
  textFieldOptions?: Partial<TextField>;
}

const getConfirmText = () => {
  return msg('OK', {
    id: 'functions.prompt.confirmText',
  });
};

const getCancelText = () => {
  return msg('Cancel', {
    id: 'functions.prompt.cancelText',
  });
};

/**
 * 打开一个 prompt，返回 Promise。
 * 如果是通过点击确定按钮关闭，则返回的 promise 会被 resolve，resolve 的参数为输入框的值；
 * 如果是通过其他方式关闭，则返回的 promise 会被 reject。
 * @param options
 */
export const prompt = (options: Options): Promise<string> => {
  const mergedOptions = Object.assign(
    {},
    {
      confirmText: getConfirmText(),
      cancelText: getCancelText(),
      onConfirm: returnTrue,
      onCancel: returnTrue,
      validator: returnTrue,
      textFieldOptions: {},
    },
    options,
  );
  const properties: (keyof Pick<
    Options,
    | 'headline'
    | 'description'
    | 'icon'
    | 'closeOnEsc'
    | 'closeOnOverlayClick'
    | 'stackedActions'
    | 'queue'
    | 'onOpen'
    | 'onOpened'
    | 'onClose'
    | 'onClosed'
    | 'onOverlayClick'
  >)[] = [
    'headline',
    'description',
    'icon',
    'closeOnEsc',
    'closeOnOverlayClick',
    'stackedActions',
    'queue',
    'onOpen',
    'onOpened',
    'onClose',
    'onClosed',
    'onOverlayClick',
  ];

  const textField = new TextField();
  Object.entries(mergedOptions.textFieldOptions).forEach(([key, value]) => {
    // @ts-ignore
    textField[key] = value;
  });

  return new Promise((resolve, reject) => {
    let isResolve = false;
    const dialog = openDialog({
      ...Object.fromEntries(
        properties
          .filter((key) => !isUndefined(mergedOptions[key]))
          .map((key) => [key, mergedOptions[key]]),
      ),
      body: textField,
      actions: [
        {
          text: mergedOptions.cancelText,
          onClick: (dialog) => {
            return mergedOptions.onCancel.call(dialog, textField.value, dialog);
          },
        },
        {
          text: mergedOptions.confirmText,
          onClick: (dialog) => {
            const onConfirm = () => {
              const clickResult = mergedOptions.onConfirm.call(
                dialog,
                textField.value,
                dialog,
              );

              if (isPromise(clickResult)) {
                clickResult.then(() => {
                  isResolve = true;
                });
              } else if (clickResult !== false) {
                isResolve = true;
              }

              return clickResult;
            };

            // 原生验证
            textField.setCustomValidity('');
            if (!textField.reportValidity()) {
              return false;
            }

            // validator 函数验证
            const validateResult = mergedOptions.validator.call(
              textField,
              textField.value,
            );

            if (isBoolean(validateResult) && !validateResult) {
              textField.setCustomValidity(' ');
              return false;
            }

            if (isString(validateResult)) {
              textField.setCustomValidity(validateResult);
              return false;
            }

            if (isPromise(validateResult)) {
              return new Promise((resolve, reject) => {
                validateResult.then(resolve).catch((reason) => {
                  textField.setCustomValidity(reason);
                  reject(reason);
                });
              });
            }

            return onConfirm();
          },
        },
      ],
    });

    // 若未传入自定义文案，则监听 locale 变化更新文案
    if (!options.confirmText) {
      onLocaleReady(dialog, () => {
        $(dialog).find('[slot="action"]').last().text(getConfirmText());
      });
    }
    if (!options.cancelText) {
      onLocaleReady(dialog, () => {
        $(dialog).find('[slot="action"]').first().text(getCancelText());
      });
    }

    $(dialog).on('close', (e) => {
      if (e.target === dialog) {
        if (isResolve) {
          resolve(textField.value);
        } else {
          reject();
        }
        offLocaleReady(dialog);
      }
    });
  });
};

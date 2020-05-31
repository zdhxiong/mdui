import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/remove';
import { isString } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../jq_extends/methods/reflow';
import '../../jq_extends/methods/transform';
import '../../jq_extends/methods/transitionEnd';
import { $document } from '../../utils/dom';
import { dequeue, queue } from '../../utils/queue';
import { startEvent } from '../../utils/touchHandler';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 打开一个 Snackbar
     * @param message Snackbar 的文本
     * @param options 配置参数
     */
    snackbar(message: string, options?: OPTIONS): Snackbar;

    /**
     * 打开一个 Snackbar
     * @param options 配置参数
     */
    snackbar(options: OPTIONS): Snackbar;
  }
}

type OPTIONS = {
  /**
   * Snackbar 的文本。通过 `mdui.snackbar(options)` 调用时，该参数不能为空
   */
  message?: string;

  /**
   * 在用户没有操作时多长时间自动隐藏，单位（毫秒）。为 `0` 时表示不自动关闭，默认为 `4000`
   */
  timeout?: number;

  /**
   * Snackbar 的位置，默认为 `bottom`。
   * 取值范围包括：
   *   `bottom`: 下方
   *   `top`: 上方
   *   `left-top`: 左上角
   *   `left-bottom`: 左下角
   *   `right-top`: 右上角
   *   `right-bottom`: 右下角
   */
  position?:
    | 'bottom'
    | 'top'
    | 'left-top'
    | 'left-bottom'
    | 'right-top'
    | 'right-bottom';

  /**
   * 按钮的文本
   */
  buttonText?: string;

  /**
   * 按钮的文本颜色，可以是颜色名或颜色值，如 `red`、`#ffffff`、`rgba(255, 255, 255, 0.3)` 等。默认为 `#90CAF9`
   */
  buttonColor?: string;

  /**
   * 点击按钮时是否关闭 Snackbar，默认为 `true`
   */
  closeOnButtonClick?: boolean;

  /**
   * 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar，默认为 `true`
   */
  closeOnOutsideClick?: boolean;

  /**
   * 在 Snackbar 上点击的回调函数，参数为 Snackbar 的实例
   */
  onClick?: (snackbar: Snackbar) => void;

  /**
   * 点击 Snackbar 上的按钮时的回调函数，参数为 Snackbar 的实例
   */
  onButtonClick?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 开始打开时的回调函数，参数为 Snackbar 的实例
   */
  onOpen?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 打开后的回调函数，参数为 Snackbar 的实例
   */
  onOpened?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 开始关闭时的回调函数，参数为 Snackbar 的实例
   */
  onClose?: (snackbar: Snackbar) => void;

  /**
   * Snackbar 关闭后的回调函数，参数为 Snackbar 的实例
   */
  onClosed?: (snackbar: Snackbar) => void;
};

type STATE = 'opening' | 'opened' | 'closing' | 'closed';

const DEFAULT_OPTIONS: OPTIONS = {
  message: '',
  timeout: 4000,
  position: 'bottom',
  buttonText: '',
  buttonColor: '',
  closeOnButtonClick: true,
  closeOnOutsideClick: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onButtonClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOpen: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onOpened: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClosed: () => {},
};

/**
 * 当前打开着的 Snackbar
 */
let currentInst: null | Snackbar = null;

/**
 * 队列名
 */
const queueName = '_mdui_snackbar';

class Snackbar {
  /**
   * Snackbar 元素
   */
  public $element: JQ;
  /**
   * 配置参数
   */
  public options: OPTIONS = extend({}, DEFAULT_OPTIONS);

  /**
   * 当前 Snackbar 的状态
   */
  private state: STATE = 'closed';

  /**
   * setTimeout 的 ID
   */
  private timeoutId: any = null;

  public constructor(options: OPTIONS) {
    extend(this.options, options);

    // 按钮颜色
    let buttonColorStyle = '';
    let buttonColorClass = '';

    if (
      this.options.buttonColor!.indexOf('#') === 0 ||
      this.options.buttonColor!.indexOf('rgb') === 0
    ) {
      buttonColorStyle = `style="color:${this.options.buttonColor}"`;
    } else if (this.options.buttonColor !== '') {
      buttonColorClass = `mdui-text-color-${this.options.buttonColor}`;
    }

    // 添加 HTML
    this.$element = $(
      '<div class="mdui-snackbar">' +
        `<div class="mdui-snackbar-text">${this.options.message}</div>` +
        (this.options.buttonText
          ? `<a href="javascript:void(0)" class="mdui-snackbar-action mdui-btn mdui-ripple mdui-ripple-white ${buttonColorClass}" ${buttonColorStyle}>${this.options.buttonText}</a>`
          : '') +
        '</div>',
    ).appendTo(document.body);

    // 设置位置
    this.setPosition('close');

    this.$element.reflow().addClass(`mdui-snackbar-${this.options.position}`);
  }

  /**
   * 点击 Snackbar 外面的区域关闭
   * @param event
   */
  private closeOnOutsideClick(event: Event): void {
    const $target = $(event.target as HTMLElement);

    if (
      !$target.hasClass('mdui-snackbar') &&
      !$target.parents('.mdui-snackbar').length
    ) {
      currentInst!.close();
    }
  }

  /**
   * 设置 Snackbar 的位置
   * @param state
   */
  private setPosition(state: 'open' | 'close'): void {
    const snackbarHeight = this.$element[0].clientHeight;
    const position = this.options.position;

    let translateX;
    let translateY;

    // translateX
    if (position === 'bottom' || position === 'top') {
      translateX = '-50%';
    } else {
      translateX = '0';
    }

    // translateY
    if (state === 'open') {
      translateY = '0';
    } else {
      if (position === 'bottom') {
        translateY = snackbarHeight;
      }

      if (position === 'top') {
        translateY = -snackbarHeight;
      }

      if (position === 'left-top' || position === 'right-top') {
        translateY = -snackbarHeight - 24;
      }

      if (position === 'left-bottom' || position === 'right-bottom') {
        translateY = snackbarHeight + 24;
      }
    }

    this.$element.transform(`translate(${translateX},${translateY}px`);
  }

  /**
   * 打开 Snackbar
   */
  public open(): void {
    if (this.state === 'opening' || this.state === 'opened') {
      return;
    }

    // 如果当前有正在显示的 Snackbar，则先加入队列，等旧 Snackbar 关闭后再打开
    if (currentInst) {
      queue(queueName, () => this.open());
      return;
    }

    currentInst = this;

    // 开始打开
    this.state = 'opening';
    this.options.onOpen!(this);

    this.setPosition('open');

    this.$element.transitionEnd(() => {
      if (this.state !== 'opening') {
        return;
      }

      this.state = 'opened';
      this.options.onOpened!(this);

      // 有按钮时绑定事件
      if (this.options.buttonText) {
        this.$element.find('.mdui-snackbar-action').on('click', () => {
          this.options.onButtonClick!(this);
          if (this.options.closeOnButtonClick) {
            this.close();
          }
        });
      }

      // 点击 snackbar 的事件
      this.$element.on('click', (event) => {
        if (!$(event.target as HTMLElement).hasClass('mdui-snackbar-action')) {
          this.options.onClick!(this);
        }
      });

      // 点击 Snackbar 外面的区域关闭
      if (this.options.closeOnOutsideClick) {
        $document.on(startEvent, this.closeOnOutsideClick);
      }

      // 超时后自动关闭
      if (this.options.timeout) {
        this.timeoutId = setTimeout(() => this.close(), this.options.timeout);
      }
    });
  }

  /**
   * 关闭 Snackbar
   */
  public close(): void {
    if (this.state === 'closing' || this.state === 'closed') {
      return;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.options.closeOnOutsideClick) {
      $document.off(startEvent, this.closeOnOutsideClick);
    }

    this.state = 'closing';
    this.options.onClose!(this);

    this.setPosition('close');

    this.$element.transitionEnd(() => {
      if (this.state !== 'closing') {
        return;
      }

      currentInst = null;
      this.state = 'closed';
      this.options.onClosed!(this);
      this.$element.remove();
      dequeue(queueName);
    });
  }
}

mdui.snackbar = function (message: any, options: any = {}): Snackbar {
  if (isString(message)) {
    options.message = message;
  } else {
    options = message;
  }

  const instance = new Snackbar(options);

  instance.open();

  return instance;
};

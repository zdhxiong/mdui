import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/html';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
import mdui from '../../mdui';
import '../../jq_extends/methods/transformOrigin';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/guid';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';
import { isAllow, register, unlockEvent } from '../../utils/touchHandler';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * Tooltip 组件
     *
     * 请通过 `new mdui.Tooltip()` 调用
     */
    Tooltip: {
      /**
       * 实例化 Tooltip 组件
       * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Tooltip;
    };
  }
}

type POSITION = 'auto' | 'bottom' | 'top' | 'left' | 'right';

type OPTIONS = {
  /**
   * Tooltip 的位置。取值范围包括 `auto`、`bottom`、`top`、`left`、`right`。
   * 为 `auto` 时，会自动判断位置。默认在下方。优先级为 `bottom` > `top` > `left` > `right`。
   * 默认为 `auto`
   */
  position?: POSITION;

  /**
   * 延时触发，单位毫秒。默认为 `0`，即没有延时。
   */
  delay?: number;

  /**
   * Tooltip 的内容
   */
  content?: string;
};

type STATE = 'opening' | 'opened' | 'closing' | 'closed';
type EVENT = 'open' | 'opened' | 'close' | 'closed';

const DEFAULT_OPTIONS: OPTIONS = {
  position: 'auto',
  delay: 0,
  content: '',
};

class Tooltip {
  /**
   * 触发 tooltip 元素的 JQ 对象
   */
  public $target: JQ;

  /**
   * tooltip 元素的 JQ 对象
   */
  public $element: JQ;

  /**
   * 配置参数
   */
  public options: OPTIONS = extend({}, DEFAULT_OPTIONS);

  /**
   * 当前 tooltip 的状态
   */
  private state: STATE = 'closed';

  /**
   * setTimeout 的返回值
   */
  private timeoutId: any = null;

  public constructor(
    selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
    options: OPTIONS = {},
  ) {
    this.$target = $(selector).first();

    extend(this.options, options);

    // 创建 Tooltip HTML
    this.$element = $(
      `<div class="mdui-tooltip" id="${$.guid()}">${
        this.options.content
      }</div>`,
    ).appendTo(document.body);

    // 绑定事件。元素处于 disabled 状态时无法触发鼠标事件，为了统一，把 touch 事件也禁用
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.$target
      .on('touchstart mouseenter', function (event) {
        if (that.isDisabled(this as HTMLElement)) {
          return;
        }

        if (!isAllow(event)) {
          return;
        }

        register(event);

        that.open();
      })
      .on('touchend mouseleave', function (event) {
        if (that.isDisabled(this as HTMLElement)) {
          return;
        }

        if (!isAllow(event)) {
          return;
        }

        that.close();
      })
      .on(unlockEvent, function (event) {
        if (that.isDisabled(this as HTMLElement)) {
          return;
        }

        register(event);
      });
  }

  /**
   * 元素是否已禁用
   * @param element
   */
  private isDisabled(element: HTMLElement): boolean {
    return (
      (element as HTMLInputElement).disabled ||
      $(element).attr('disabled') !== undefined
    );
  }

  /**
   * 是否是桌面设备
   */
  private isDesktop(): boolean {
    return $window.width() > 1024;
  }

  /**
   * 设置 Tooltip 的位置
   */
  private setPosition(): void {
    let marginLeft: number;
    let marginTop: number;

    // 触发的元素
    const targetProps = this.$target[0].getBoundingClientRect();

    // 触发的元素和 Tooltip 之间的距离
    const targetMargin = this.isDesktop() ? 14 : 24;

    // Tooltip 的宽度和高度
    const tooltipWidth = this.$element[0].offsetWidth;
    const tooltipHeight = this.$element[0].offsetHeight;

    // Tooltip 的方向
    let position: POSITION = this.options.position!;

    // 自动判断位置，加 2px，使 Tooltip 距离窗口边框至少有 2px 的间距
    if (position === 'auto') {
      if (
        targetProps.top +
          targetProps.height +
          targetMargin +
          tooltipHeight +
          2 <
        $window.height()
      ) {
        position = 'bottom';
      } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
        position = 'top';
      } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
        position = 'left';
      } else if (
        targetProps.width + targetMargin + tooltipWidth + 2 <
        $window.width() - targetProps.left
      ) {
        position = 'right';
      } else {
        position = 'bottom';
      }
    }

    // 设置位置
    switch (position) {
      case 'bottom':
        marginLeft = -1 * (tooltipWidth / 2);
        marginTop = targetProps.height / 2 + targetMargin;
        this.$element.transformOrigin('top center');
        break;

      case 'top':
        marginLeft = -1 * (tooltipWidth / 2);
        marginTop =
          -1 * (tooltipHeight + targetProps.height / 2 + targetMargin);
        this.$element.transformOrigin('bottom center');
        break;

      case 'left':
        marginLeft = -1 * (tooltipWidth + targetProps.width / 2 + targetMargin);
        marginTop = -1 * (tooltipHeight / 2);
        this.$element.transformOrigin('center right');
        break;

      case 'right':
        marginLeft = targetProps.width / 2 + targetMargin;
        marginTop = -1 * (tooltipHeight / 2);
        this.$element.transformOrigin('center left');
        break;
    }

    const targetOffset = this.$target.offset();

    this.$element.css({
      top: `${targetOffset.top + targetProps.height / 2}px`,
      left: `${targetOffset.left + targetProps.width / 2}px`,
      'margin-left': `${marginLeft}px`,
      'margin-top': `${marginTop}px`,
    });
  }

  /**
   * 触发组件事件
   * @param name
   */
  private triggerEvent(name: EVENT): void {
    componentEvent(name, 'tooltip', this.$target, this);
  }

  /**
   * 动画结束回调
   */
  private transitionEnd(): void {
    if (this.$element.hasClass('mdui-tooltip-open')) {
      this.state = 'opened';
      this.triggerEvent('opened');
    } else {
      this.state = 'closed';
      this.triggerEvent('closed');
    }
  }

  /**
   * 当前 tooltip 是否为打开状态
   */
  private isOpen(): boolean {
    return this.state === 'opening' || this.state === 'opened';
  }

  /**
   * 执行打开 tooltip
   */
  private doOpen(): void {
    this.state = 'opening';
    this.triggerEvent('open');

    this.$element
      .addClass('mdui-tooltip-open')
      .transitionEnd(() => this.transitionEnd());
  }

  /**
   * 打开 Tooltip
   * @param options 允许每次打开时设置不同的参数
   */
  public open(options?: OPTIONS): void {
    if (this.isOpen()) {
      return;
    }

    const oldOptions = extend({}, this.options);

    if (options) {
      extend(this.options, options);
    }

    // tooltip 的内容有更新
    if (oldOptions.content !== this.options.content) {
      this.$element.html(this.options.content);
    }

    this.setPosition();

    if (this.options.delay) {
      this.timeoutId = setTimeout(() => this.doOpen(), this.options.delay);
    } else {
      this.timeoutId = null;
      this.doOpen();
    }
  }

  /**
   * 关闭 Tooltip
   */
  public close(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (!this.isOpen()) {
      return;
    }

    this.state = 'closing';
    this.triggerEvent('close');

    this.$element
      .removeClass('mdui-tooltip-open')
      .transitionEnd(() => this.transitionEnd());
  }

  /**
   * 切换 Tooltip 的打开状态
   */
  public toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /**
   * 获取 Tooltip 状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
   */
  public getState(): STATE {
    return this.state;
  }
}

mdui.Tooltip = Tooltip;

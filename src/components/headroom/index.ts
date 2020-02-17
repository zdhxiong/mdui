import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import Selector from 'mdui.jq/es/types/Selector';
import { isNumber } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../jq_extends/methods/transitionEnd';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * Headroom 插件
     *
     * 请通过 `new mdui.Headroom()` 调用
     */
    Headroom: {
      /**
       * 实例化 Headroom 组件
       * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Headroom;
    };
  }
}

type TOLERANCE = {
  /**
   * 滚动条向下滚动多少距离开始隐藏或显示元素
   */
  down: number;

  /**
   * 滚动条向上滚动多少距离开始隐藏或显示元素
   */
  up: number;
};

type OPTIONS = {
  /**
   * 滚动条滚动多少距离开始隐藏或显示元素
   */
  tolerance?: TOLERANCE | number;

  /**
   * 在页面顶部多少距离内滚动不会隐藏元素
   */
  offset?: number;

  /**
   * 初始化时添加的类
   */
  initialClass?: string;

  /**
   * 元素固定时添加的类
   */
  pinnedClass?: string;

  /**
   * 元素隐藏时添加的类
   */
  unpinnedClass?: string;
};

type STATE = 'pinning' | 'pinned' | 'unpinning' | 'unpinned';
type EVENT = 'pin' | 'pinned' | 'unpin' | 'unpinned';

const DEFAULT_OPTIONS: OPTIONS = {
  tolerance: 5,
  offset: 0,
  initialClass: 'mdui-headroom',
  pinnedClass: 'mdui-headroom-pinned-top',
  unpinnedClass: 'mdui-headroom-unpinned-top',
};

class Headroom {
  /**
   * headroom 元素的 JQ 对象
   */
  public $element: JQ;

  /**
   * 配置参数
   */
  public options: OPTIONS = extend({}, DEFAULT_OPTIONS);

  /**
   * 当前 headroom 的状态
   */
  private state: STATE = 'pinned';

  /**
   * 当前是否启用
   */
  private isEnable = false;

  /**
   * 上次滚动后，垂直方向的距离
   */
  private lastScrollY = 0;

  /**
   * AnimationFrame ID
   */
  private rafId = 0;

  public constructor(
    selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
    options: OPTIONS = {},
  ) {
    this.$element = $(selector).first();

    extend(this.options, options);

    // tolerance 参数若为数值，转换为对象
    const tolerance = this.options.tolerance;
    if (isNumber(tolerance)) {
      this.options.tolerance = {
        down: tolerance,
        up: tolerance,
      };
    }

    this.enable();
  }

  /**
   * 滚动时的处理
   */
  private onScroll(): void {
    this.rafId = window.requestAnimationFrame(() => {
      const currentScrollY = window.pageYOffset;
      const direction = currentScrollY > this.lastScrollY ? 'down' : 'up';
      const tolerance = (this.options.tolerance as TOLERANCE)[direction];
      const scrolled = Math.abs(currentScrollY - this.lastScrollY);
      const toleranceExceeded = scrolled >= tolerance;

      if (
        currentScrollY > this.lastScrollY &&
        currentScrollY >= this.options.offset! &&
        toleranceExceeded
      ) {
        this.unpin();
      } else if (
        (currentScrollY < this.lastScrollY && toleranceExceeded) ||
        currentScrollY <= this.options.offset!
      ) {
        this.pin();
      }

      this.lastScrollY = currentScrollY;
    });
  }

  /**
   * 触发组件事件
   * @param name
   */
  private triggerEvent(name: EVENT): void {
    componentEvent(name, 'headroom', this.$element, this);
  }

  /**
   * 动画结束的回调
   */
  private transitionEnd(): void {
    if (this.state === 'pinning') {
      this.state = 'pinned';
      this.triggerEvent('pinned');
    }

    if (this.state === 'unpinning') {
      this.state = 'unpinned';
      this.triggerEvent('unpinned');
    }
  }

  /**
   * 使元素固定住
   */
  public pin(): void {
    if (
      this.state === 'pinning' ||
      this.state === 'pinned' ||
      !this.$element.hasClass(this.options.initialClass!)
    ) {
      return;
    }

    this.triggerEvent('pin');
    this.state = 'pinning';
    this.$element
      .removeClass(this.options.unpinnedClass)
      .addClass(this.options.pinnedClass!)
      .transitionEnd(() => this.transitionEnd());
  }

  /**
   * 使元素隐藏
   */
  public unpin(): void {
    if (
      this.state === 'unpinning' ||
      this.state === 'unpinned' ||
      !this.$element.hasClass(this.options.initialClass!)
    ) {
      return;
    }

    this.triggerEvent('unpin');
    this.state = 'unpinning';
    this.$element
      .removeClass(this.options.pinnedClass)
      .addClass(this.options.unpinnedClass!)
      .transitionEnd(() => this.transitionEnd());
  }

  /**
   * 启用 headroom 插件
   */
  public enable(): void {
    if (this.isEnable) {
      return;
    }

    this.isEnable = true;
    this.state = 'pinned';
    this.$element
      .addClass(this.options.initialClass!)
      .removeClass(this.options.pinnedClass)
      .removeClass(this.options.unpinnedClass);
    this.lastScrollY = window.pageYOffset;

    $window.on('scroll', () => this.onScroll());
  }

  /**
   * 禁用 headroom 插件
   */
  public disable(): void {
    if (!this.isEnable) {
      return;
    }

    this.isEnable = false;
    this.$element
      .removeClass(this.options.initialClass)
      .removeClass(this.options.pinnedClass)
      .removeClass(this.options.unpinnedClass);

    $window.off('scroll', () => this.onScroll());
    window.cancelAnimationFrame(this.rafId);
  }

  /**
   * 获取当前状态。共包含四种状态：`pinning`、`pinned`、`unpinning`、`unpinned`
   */
  public getState(): STATE {
    return this.state;
  }
}

mdui.Headroom = Headroom;

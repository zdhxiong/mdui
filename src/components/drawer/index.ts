/**
 * 在桌面设备上默认显示抽屉栏，不显示遮罩层
 * 在手机和平板设备上默认不显示抽屉栏，始终显示遮罩层，且覆盖导航栏
 */

import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/one';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
import mdui from '../../mdui';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/hideOverlay';
import '../../jq_extends/static/lockScreen';
import '../../jq_extends/static/showOverlay';
import '../../jq_extends/static/throttle';
import '../../jq_extends/static/unlockScreen';
import { componentEvent } from '../../utils/componentEvent';
import { $body, $window } from '../../utils/dom';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * Drawer 组件
     *
     * 请通过 `new mdui.Drawer()` 调用
     */
    Drawer: {
      /**
       * 实例化 Drawer 组件
       * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Drawer;
    };
  }
}

type OPTIONS = {
  /**
   * 打开抽屉栏时是否显示遮罩层。该参数只对中等屏幕及以上的设备有效，在超小屏和小屏设备上始终会显示遮罩层。
   */
  overlay?: boolean;

  /**
   * 是否启用滑动手势。
   */
  swipe?: boolean;
};

type STATE = 'opening' | 'opened' | 'closing' | 'closed';
type EVENT = 'open' | 'opened' | 'close' | 'closed';

const DEFAULT_OPTIONS: OPTIONS = {
  overlay: false,
  swipe: false,
};

class Drawer {
  /**
   * drawer 元素的 JQ 对象
   */
  public $element: JQ;

  /**
   * 配置参数
   */
  public options: OPTIONS = extend({}, DEFAULT_OPTIONS);

  /**
   * 当前是否显示着遮罩层
   */
  private overlay = false;

  /**
   * 抽屉栏的位置
   */
  private position: 'left' | 'right';

  /**
   * 当前抽屉栏状态
   */
  private state: STATE;

  public constructor(
    selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
    options: OPTIONS = {},
  ) {
    this.$element = $(selector).first();

    extend(this.options, options);

    this.position = this.$element.hasClass('mdui-drawer-right')
      ? 'right'
      : 'left';

    if (this.$element.hasClass('mdui-drawer-close')) {
      this.state = 'closed';
    } else if (this.$element.hasClass('mdui-drawer-open')) {
      this.state = 'opened';
    } else if (this.isDesktop()) {
      this.state = 'opened';
    } else {
      this.state = 'closed';
    }

    // 浏览器窗口大小调整时
    $window.on(
      'resize',
      $.throttle(() => {
        if (this.isDesktop()) {
          // 由手机平板切换到桌面时
          // 如果显示着遮罩，则隐藏遮罩
          if (this.overlay && !this.options.overlay) {
            $.hideOverlay();
            this.overlay = false;
            $.unlockScreen();
          }

          // 没有强制关闭，则状态为打开状态
          if (!this.$element.hasClass('mdui-drawer-close')) {
            this.state = 'opened';
          }
        } else if (!this.overlay && this.state === 'opened') {
          // 由桌面切换到手机平板时。如果抽屉栏是打开着的且没有遮罩层，则关闭抽屉栏
          if (this.$element.hasClass('mdui-drawer-open')) {
            $.showOverlay();
            this.overlay = true;
            $.lockScreen();

            $('.mdui-overlay').one('click', () => this.close());
          } else {
            this.state = 'closed';
          }
        }
      }, 100),
    );

    // 绑定关闭按钮事件
    this.$element.find('[mdui-drawer-close]').each((_, close) => {
      $(close).on('click', () => this.close());
    });

    this.swipeSupport();
  }

  /**
   * 是否是桌面设备
   */
  private isDesktop(): boolean {
    return $window.width() >= 1024;
  }

  /**
   * 滑动手势支持
   */
  private swipeSupport(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    // 抽屉栏滑动手势控制
    let openNavEventHandler: (event: Event) => void;
    let touchStartX: number;
    let touchStartY: number;
    let swipeStartX: number;
    let swiping: null | 'opening' | 'closing' = null;
    let maybeSwiping = false;

    // 手势触发的范围
    const swipeAreaWidth = 24;

    function setPosition(translateX: number): void {
      const rtlTranslateMultiplier = that.position === 'right' ? -1 : 1;
      const transformCSS = `translate(${
        -1 * rtlTranslateMultiplier * translateX
      }px, 0) !important;`;
      const transitionCSS = 'initial !important;';

      that.$element.css(
        'cssText',
        `transform: ${transformCSS}; transition: ${transitionCSS};`,
      );
    }

    function cleanPosition(): void {
      that.$element[0].style.transform = '';
      that.$element[0].style.webkitTransform = '';
      that.$element[0].style.transition = '';
      that.$element[0].style.webkitTransition = '';
    }

    function getMaxTranslateX(): number {
      return that.$element.width() + 10;
    }

    function getTranslateX(currentX: number): number {
      return Math.min(
        Math.max(
          swiping === 'closing'
            ? swipeStartX - currentX
            : getMaxTranslateX() + swipeStartX - currentX,
          0,
        ),
        getMaxTranslateX(),
      );
    }

    function onBodyTouchEnd(event?: Event): void {
      if (swiping) {
        let touchX = (event as TouchEvent).changedTouches[0].pageX;
        if (that.position === 'right') {
          touchX = $body.width() - touchX;
        }

        const translateRatio = getTranslateX(touchX) / getMaxTranslateX();

        maybeSwiping = false;
        const swipingState = swiping;
        swiping = null;

        if (swipingState === 'opening') {
          if (translateRatio < 0.92) {
            cleanPosition();
            that.open();
          } else {
            cleanPosition();
          }
        } else {
          if (translateRatio > 0.08) {
            cleanPosition();
            that.close();
          } else {
            cleanPosition();
          }
        }

        $.unlockScreen();
      } else {
        maybeSwiping = false;
      }

      $body.off({
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        touchmove: onBodyTouchMove,
        touchend: onBodyTouchEnd,
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        touchcancel: onBodyTouchMove,
      });
    }

    function onBodyTouchMove(event: Event): void {
      let touchX = (event as TouchEvent).touches[0].pageX;
      if (that.position === 'right') {
        touchX = $body.width() - touchX;
      }

      const touchY = (event as TouchEvent).touches[0].pageY;

      if (swiping) {
        setPosition(getTranslateX(touchX));
      } else if (maybeSwiping) {
        const dXAbs = Math.abs(touchX - touchStartX);
        const dYAbs = Math.abs(touchY - touchStartY);
        const threshold = 8;

        if (dXAbs > threshold && dYAbs <= threshold) {
          swipeStartX = touchX;
          swiping = that.state === 'opened' ? 'closing' : 'opening';
          $.lockScreen();
          setPosition(getTranslateX(touchX));
        } else if (dXAbs <= threshold && dYAbs > threshold) {
          onBodyTouchEnd();
        }
      }
    }

    function onBodyTouchStart(event: Event): void {
      touchStartX = (event as TouchEvent).touches[0].pageX;
      if (that.position === 'right') {
        touchStartX = $body.width() - touchStartX;
      }

      touchStartY = (event as TouchEvent).touches[0].pageY;

      if (that.state !== 'opened') {
        if (
          touchStartX > swipeAreaWidth ||
          openNavEventHandler !== onBodyTouchStart
        ) {
          return;
        }
      }

      maybeSwiping = true;

      $body.on({
        touchmove: onBodyTouchMove,
        touchend: onBodyTouchEnd,
        touchcancel: onBodyTouchMove,
      });
    }

    function enableSwipeHandling(): void {
      if (!openNavEventHandler) {
        $body.on('touchstart', onBodyTouchStart);
        openNavEventHandler = onBodyTouchStart;
      }
    }

    if (this.options.swipe) {
      enableSwipeHandling();
    }
  }

  /**
   * 触发组件事件
   * @param name
   */
  private triggerEvent(name: EVENT): void {
    componentEvent(name, 'drawer', this.$element, this);
  }

  /**
   * 动画结束回调
   */
  private transitionEnd(): void {
    if (this.$element.hasClass('mdui-drawer-open')) {
      this.state = 'opened';
      this.triggerEvent('opened');
    } else {
      this.state = 'closed';
      this.triggerEvent('closed');
    }
  }

  /**
   * 是否处于打开状态
   */
  private isOpen(): boolean {
    return this.state === 'opening' || this.state === 'opened';
  }

  /**
   * 打开抽屉栏
   */
  public open(): void {
    if (this.isOpen()) {
      return;
    }

    this.state = 'opening';
    this.triggerEvent('open');

    if (!this.options.overlay) {
      $body.addClass(`mdui-drawer-body-${this.position}`);
    }

    this.$element
      .removeClass('mdui-drawer-close')
      .addClass('mdui-drawer-open')
      .transitionEnd(() => this.transitionEnd());

    if (!this.isDesktop() || this.options.overlay) {
      this.overlay = true;
      $.showOverlay().one('click', () => this.close());
      $.lockScreen();
    }
  }

  /**
   * 关闭抽屉栏
   */
  public close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.state = 'closing';
    this.triggerEvent('close');

    if (!this.options.overlay) {
      $body.removeClass(`mdui-drawer-body-${this.position}`);
    }

    this.$element
      .addClass('mdui-drawer-close')
      .removeClass('mdui-drawer-open')
      .transitionEnd(() => this.transitionEnd());

    if (this.overlay) {
      $.hideOverlay();
      this.overlay = false;
      $.unlockScreen();
    }
  }

  /**
   * 切换抽屉栏打开/关闭状态
   */
  public toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /**
   * 返回当前抽屉栏的状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
   */
  public getState(): STATE {
    return this.state;
  }
}

mdui.Drawer = Drawer;

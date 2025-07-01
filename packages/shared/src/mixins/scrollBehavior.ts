import { property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { DefinedController } from '../controllers/defined.js';
import { watch } from '../decorators/watch.js';
import type { Constructor } from '@lit/reactive-element/decorators/base.js';
import type { JQ } from '@mdui/jq/shared/core.js';
import type { LitElement } from 'lit';

type ScrollBehavior = 'hide' | 'shrink' | 'elevate';

export type ScrollPaddingPosition = 'top' | 'bottom';

export declare class ScrollBehaviorMixinInterface {
  public scrollTarget?: string | HTMLElement | JQ<HTMLElement>;
  public scrollBehavior?: ScrollBehavior;
  public scrollThreshold?: number;
  protected scrollBehaviorDefinedController: DefinedController;
  protected setContainerPadding(
    action: 'add' | 'update' | 'remove',
    scrollTarget?: string | HTMLElement | JQ<HTMLElement>,
  ): void;
  protected hasScrollBehavior(
    behavior: ScrollBehavior | ScrollBehavior[],
  ): boolean;
}

/**
 * 如果同时有多个组件在同一个元素上设置了 padding-top 或 padding-bottom，则移除其中一个组件时，不移除 padding-top 或 padding-bottom
 * 键为添加 padding 的目标元素，值为在分别在 top 和 bottom 上添加的组件数组
 */
const weakMap = new WeakMap<
  HTMLElement,
  { top: HTMLElement[]; bottom: HTMLElement[] }
>();

/**
 * 滚动行为
 *
 * 父类需要实现
 * @property() public scrollBehavior
 * protected runScrollThreshold(isScrollingUp: boolean, scrollTop: number): void;
 * protected runScrollNoThreshold(isScrollingUp: boolean, scrollTop: number): void;
 * protected get scrollPaddingPosition(): ScrollPaddingPosition
 */
export const ScrollBehaviorMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<ScrollBehaviorMixinInterface> & T => {
  class ScrollBehaviorMixinClass extends superclass {
    /**
     * 需要监听其滚动事件的元素。值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](/docs/2/functions/jq)。默认监听 `window` 的滚动事件
     */
    @property({ attribute: 'scroll-target' })
    public scrollTarget?: string | HTMLElement | JQ<HTMLElement>;

    /**
     * 滚动行为。可选值为：
     * * `hide`：滚动时隐藏
     * * `shrink`：滚动时缩小
     * * `elevate`：滚动时增加阴影
     *
     * todo: 生成 custom-elements.json 时，属性名的注释用了父类的，属性枚举值的类型和注释用了该类的。期望都使用父类的。
     */
    @property({ reflect: true, attribute: 'scroll-behavior' })
    public scrollBehavior?: 'hide' | 'shrink' | 'elevate';

    /**
     * 在滚动多少距离之后触发滚动行为，单位为 `px`
     */
    @property({ type: Number, reflect: true, attribute: 'scroll-threshold' })
    public scrollThreshold?: number;

    protected scrollBehaviorDefinedController = new DefinedController(this, {
      needDomReady: true,
    });

    /**
     * 上次滚动后，垂直方向的距离（滚动距离超过 scrollThreshold 才记录）
     */
    private lastScrollTopThreshold = 0;

    /**
     * 上次滚动后，垂直方向的距离（无视 scrollThreshold，始终记录）
     */
    private lastScrollTopNoThreshold = 0;

    /**
     * 父元素是否是 `mdui-layout`
     */
    private isParentLayout = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(...args: any[]) {
      super(...args);

      this.onListeningScroll = this.onListeningScroll.bind(this);
    }

    /**
     * 滚动时，如果需要给 container 添加 padding，添加在顶部还是底部
     */
    protected get scrollPaddingPosition(): ScrollPaddingPosition {
      throw new Error('Must implement scrollPaddingPosition getter');
    }

    @watch('scrollTarget')
    private async onScrollTargetChange(oldValue: string, newValue: string) {
      const hasUpdated = this.hasUpdated;
      await this.scrollBehaviorDefinedController.whenDefined();

      // 旧元素移除 padding，新元素添加 padding
      if (hasUpdated) {
        this.setContainerPadding('remove', oldValue);
        this.setContainerPadding('add', newValue);
      }

      if (!this.scrollBehavior) {
        return;
      }

      const oldListening = this.getListening(oldValue);
      if (oldListening) {
        oldListening.removeEventListener('scroll', this.onListeningScroll);
      }

      const newListening = this.getListening(newValue);
      if (newListening) {
        this.updateScrollTop(newListening);

        newListening.addEventListener('scroll', this.onListeningScroll);
      }
    }

    @watch('scrollBehavior')
    private async onScrollBehaviorChange() {
      await this.scrollBehaviorDefinedController.whenDefined();

      const listening = this.getListening(this.scrollTarget);
      if (!listening) {
        return;
      }

      if (this.scrollBehavior) {
        this.updateScrollTop(listening);

        listening.addEventListener('scroll', this.onListeningScroll);
      } else {
        listening.removeEventListener('scroll', this.onListeningScroll);
      }
    }

    public override connectedCallback(): void {
      super.connectedCallback();

      this.scrollBehaviorDefinedController.whenDefined().then(() => {
        this.isParentLayout = isNodeName(this.parentElement, 'mdui-layout');
        this.setContainerPadding('add', this.scrollTarget);
      });
    }

    public override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.scrollBehaviorDefinedController.whenDefined().then(() => {
        this.setContainerPadding('remove', this.scrollTarget);
      });
    }

    /**
     * scrollBehavior 包含多个滚动行为，用空格分割
     * 用该方法判断指定滚动行为是否在 scrollBehavior 中
     * @param behavior 为数组时，只要其中一个行为在 scrollBehavior 中，即返回 `true`
     */
    protected hasScrollBehavior(
      behavior: ScrollBehavior | ScrollBehavior[],
    ): boolean {
      const behaviors = (this.scrollBehavior?.split(' ') ??
        []) as ScrollBehavior[];

      if (Array.isArray(behavior)) {
        return !!behaviors.filter((v) => behavior.includes(v)).length;
      } else {
        return behaviors.includes(behavior);
      }
    }

    /**
     * 执行滚动事件，在滚动距离超过 scrollThreshold 时才会执行
     * Note: 父类可以按需实现该方法
     * @param _isScrollingUp 是否向上滚动
     * @param _scrollTop 距离 scrollTarget 顶部的距离
     */

    protected runScrollThreshold(_isScrollingUp: boolean, _scrollTop: number) {
      return;
    }

    /**
     * 执行滚动事件，会无视 scrollThreshold，始终会执行
     * @param _isScrollingUp 是否向上滚动
     * @param _scrollTop 距离 scrollTarget 顶部的距离
     */

    protected runScrollNoThreshold(
      _isScrollingUp: boolean,
      _scrollTop: number,
    ) {
      return;
    }

    /**
     * 更新滚动容器的 padding，避免内容被 navigation-bar 覆盖
     * @param action 新增、更新、移除 padding
     * @param scrollTarget 在该元素上添加、更新或移除 padding
     */
    protected setContainerPadding(
      action: 'add' | 'update' | 'remove',
      scrollTarget?: string | HTMLElement | JQ<HTMLElement>,
    ): void {
      const container = this.getContainer(scrollTarget);
      if (!container || this.isParentLayout) {
        return;
      }

      const position = this.scrollPaddingPosition;
      const propName = position === 'top' ? 'paddingTop' : 'paddingBottom';

      if (action === 'add' || action === 'update') {
        const propValue = ['fixed', 'absolute'].includes(
          $(this).css('position'),
        )
          ? this.offsetHeight
          : null;

        $(container).css({ [propName]: propValue });

        // 添加 padding 时，weakMap 中添加指定元素
        if (action === 'add' && propValue !== null) {
          const options = weakMap.get(container) ?? { top: [], bottom: [] };
          options[position].push(this);
          weakMap.set(container, options);
        }
      }

      // 如果 weakMap 中指定元素的计数为 0，则移除 padding
      if (action === 'remove') {
        const options = weakMap.get(container);
        if (!options) {
          return;
        }

        const index = options[position].indexOf(this);
        if (index > -1) {
          options[position].splice(index, 1);
          weakMap.set(container, options);
        }

        if (!options[position].length) {
          $(container).css({ [propName]: null });
        }
      }
    }

    private onListeningScroll() {
      const listening = this.getListening(this.scrollTarget)!;

      window.requestAnimationFrame(() => this.onScroll(listening));
    }

    /**
     * 滚动事件，这里过滤掉不符合条件的滚动
     */
    private onScroll(listening: HTMLElement | Window): void {
      const scrollTop =
        (listening as Window).scrollY ?? (listening as HTMLElement).scrollTop;

      // 无视 scrollThreshold 的回调
      if (this.lastScrollTopNoThreshold !== scrollTop) {
        this.runScrollNoThreshold(
          scrollTop < this.lastScrollTopNoThreshold,
          scrollTop,
        );
        this.lastScrollTopNoThreshold = scrollTop;
      }

      // 滚动距离大于 scrollThreshold 时才执行的回调
      if (
        Math.abs(scrollTop - this.lastScrollTopThreshold) >
        (this.scrollThreshold || 0)
      ) {
        this.runScrollThreshold(
          scrollTop < this.lastScrollTopThreshold,
          scrollTop,
        );
        this.lastScrollTopThreshold = scrollTop;
      }
    }

    /**
     * 重新更新 lastScrollTopThreshold、lastScrollTopNoThreshold 的值
     * 用于在 scrollTarget、scrollBehavior 变更时，重新设置 lastScrollTopThreshold、lastScrollTopNoThreshold 的初始值
     */
    private updateScrollTop(listening: HTMLElement | Window): void {
      this.lastScrollTopThreshold = this.lastScrollTopNoThreshold =
        (listening as Window).scrollY ?? (listening as HTMLElement).scrollTop;
    }

    /**
     * 获取组件需要监听哪个元素的滚动状态
     */
    private getListening(
      target?: string | HTMLElement | JQ<HTMLElement>,
    ): HTMLElement | Window | undefined {
      return target ? $(target)[0] : window;
    }

    /**
     * 获取组件在哪个容器内滚动
     */
    private getContainer(
      target?: string | HTMLElement | JQ<HTMLElement>,
    ): HTMLElement | undefined {
      return target ? $(target)[0] : document.body;
    }
  }

  return ScrollBehaviorMixinClass as unknown as Constructor<ScrollBehaviorMixinInterface> &
    T;
};

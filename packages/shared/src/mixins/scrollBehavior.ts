import { property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { watch } from '../decorators/watch.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LitElement } from 'lit';

type ScrollBehavior = 'hide' | 'shrink' | 'elevate';

export type ScrollPaddingPosition = 'top' | 'bottom';

export declare class ScrollBehaviorMixinInterface extends LitElement {
  public scrollTarget?: HTMLElement | string;
  public scrollBehavior?: ScrollBehavior;
  public scrollThreshold?: number;
  protected updateContainerPadding(): void;
  protected hasScrollBehavior(
    behavior: ScrollBehavior | ScrollBehavior[],
  ): boolean;
}

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
     * 需要监听其滚动事件的元素，值可以是 DOM 元素或 CSS 选择器。默认为监听 `window`
     */
    @property({ attribute: 'scroll-target' })
    public scrollTarget?: HTMLElement | string;

    /**
     * 滚动行为。可选值为：
     * * `hide`：滚动时隐藏
     * * `shrink`：滚动时缩小
     * * `elevate`：滚动时增加阴影
     */
    @property({ reflect: true, attribute: 'scroll-behavior' })
    public scrollBehavior?: 'hide' | 'shrink' | 'elevate';

    /**
     * 在滚动多少距离之后触发滚动行为
     */
    @property({ type: Number, reflect: true, attribute: 'scroll-threshold' })
    public scrollThreshold?: number;

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
    private onScrollTargetChange(oldValue: string, newValue: string) {
      // 仅在有值切换到无值、或无值切换到有值时，更新
      if ((oldValue && !newValue) || (!oldValue && newValue)) {
        this.updateContainerPadding();
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
    private onScrollBehaviorChange(oldValue: string, newValue: string) {
      // 仅在有值切换到无值、或无值切换到有值时，更新
      if ((oldValue && !newValue) || (!oldValue && newValue)) {
        this.updateContainerPadding();
      }

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

      this.isParentLayout = isNodeName(this.parentElement, 'mdui-layout');
      this.updateContainerPadding();
    }

    public override disconnectedCallback(): void {
      super.disconnectedCallback();

      this.updateContainerPadding(false);
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
     * @param isScrollingUp 是否向上滚动
     * @param scrollTop 距离 scrollTarget 顶部的距离
     */
    protected runScrollThreshold(isScrollingUp: boolean, scrollTop: number) {
      return;
    }

    /**
     * 执行滚动事件，会无视 scrollThreshold，始终会执行
     * @param isScrollingUp 是否向上滚动
     * @param scrollTop 距离 scrollTarget 顶部的距离
     */
    protected runScrollNoThreshold(isScrollingUp: boolean, scrollTop: number) {
      return;
    }

    /**
     * 更新滚动容器的 padding，避免内容被 navigation-bar 覆盖
     * 仅 scrollBehavior 包含 hide、shrink 时，添加 padding
     * @param withPadding 该值为 false 时，为移除 padding
     */
    protected updateContainerPadding(withPadding = true): void {
      const container = this.getContainer(this.scrollTarget);
      if (!container || this.isParentLayout) {
        return;
      }

      const propName =
        this.scrollPaddingPosition === 'top' ? 'paddingTop' : 'paddingBottom';

      if (withPadding) {
        const propValue =
          this.scrollBehavior &&
          this.getListening(this.scrollTarget) &&
          ['fixed', 'absolute'].includes($(this).css('position'))
            ? this.offsetHeight
            : null;

        $(container).css({ [propName]: propValue });
      } else {
        $(container).css({ [propName]: null });
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
      target?: HTMLElement | string,
    ): HTMLElement | Window | undefined {
      return target ? $(target)[0] : window;
    }

    /**
     * 获取组件在哪个容器内滚动
     */
    private getContainer(
      target?: HTMLElement | string,
    ): HTMLElement | undefined {
      return target ? $(target)[0] : document.body;
    }
  }

  // @ts-ignore
  return ScrollBehaviorMixinClass;
};

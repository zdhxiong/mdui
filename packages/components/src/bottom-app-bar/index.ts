import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 底部应用栏内部的元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-bottom-app-bar')
export class BottomAppBar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  protected readonly uniqueId = uniqueId();
  protected readonly scrollEventName = `scroll._bottom_app_bar_${this.uniqueId}`;

  /**
   * 是否隐藏
   */
  @property({ type: Boolean, reflect: true })
  public hide = false;

  /**
   * 在页面向上滚动时，是否隐藏组件
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-on-scroll' })
  public hideOnScroll = false;

  /**
   * 是否使底部应用栏中的 `<mdui-fab>` 组件脱离应用栏。若为 `true`，则在应用栏隐藏后，`<mdui-fab>` 仍将停留在页面上
   */
  @property({ type: Boolean, reflect: true, attribute: 'fab-detach' })
  public fabDetach = false;

  /**
   * 需要监听其滚动事件的元素的 CSS 选择器。默认为监听 window 滚动
   */
  @property({ reflect: true, attribute: 'scroll-target' })
  public scrollTarget!: string;

  /**
   * 在 hide-on-scroll 激活之前的滚动距离
   */
  @property({ type: Number, reflect: true, attribute: 'scroll-threshold' })
  public scrollThreshold!: number;

  /**
   * 组件需要监听该元素的滚动状态
   */
  protected get scrollTargetListening(): HTMLElement | Window {
    return this.scrollTarget ? $(this.scrollTarget)[0] : window;
  }

  /**
   * 组件在该容器内滚动
   */
  protected get scrollTargetContainer(): HTMLElement {
    return this.scrollTarget ? $(this.scrollTarget)[0] : document.body;
  }

  override connectedCallback() {
    super.connectedCallback();
    $(this.scrollTargetListening).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    $(this).on('transitionend', (e: TransitionEvent) => {
      if (e.target === this) {
        emit(this, this.hide ? 'hidden' : 'shown');
      }
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    $(this.scrollTargetListening).off(this.scrollEventName);
  }

  @watch('scrollTarget')
  protected onScrollTargetChange(
    oldScrollTarget: string,
    newScrollTarget: string,
  ) {
    $(oldScrollTarget ?? window).off(this.scrollEventName);
    $(newScrollTarget).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    this.onScroll();
  }

  @watch('hideOnScroll')
  protected onHideOnScrollChange() {
    // hideOnScroll 为 false 时，为 scrollTargetContainer 元素添加 padding-bottom。避免 bottom-app-bar 覆盖内容
    $(this.scrollTargetContainer).css({
      'padding-bottom': this.hideOnScroll ? '' : this.offsetHeight,
    });
  }

  private lastScrollTop = 0; // 上次滚动后，垂直方向的距离
  protected onScroll() {
    if (!this.hideOnScroll) {
      return;
    }

    const scrollTop =
      (this.scrollTargetListening as Window).scrollY ||
      (this.scrollTargetListening as HTMLElement).scrollTop;

    if (
      Math.abs(scrollTop - this.lastScrollTop) <= (this.scrollThreshold || 0)
    ) {
      return;
    }

    if (scrollTop > this.lastScrollTop && !this.hide) {
      const requestHide = emit(this, 'hide');
      if (!requestHide.defaultPrevented) {
        this.hide = true;
      }
    } else if (scrollTop < this.lastScrollTop && this.hide) {
      const requestShow = emit(this, 'show');
      if (!requestShow.defaultPrevented) {
        this.hide = false;
      }
    }

    this.lastScrollTop = scrollTop;
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-bottom-app-bar': BottomAppBar;
  }
}

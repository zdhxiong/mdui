import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/one.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { topAppBarStyle } from './top-app-bar-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type TopAppBarTitle = {
  variant: 'center-aligned' | 'small' | 'medium' | 'large';
  shrink: boolean;
};

/**
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 顶部应用栏内部的元素
 *
 * @csspart large-title - variant="medium" 和 variant="large" 时，展开的大标题
 * @csspart large-title-inner - variant="medium" 和 variant="large" 时，展开的大标题的内部元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-top-app-bar')
export class TopAppBar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, topAppBarStyle];

  @queryAssignedElements({ selector: 'mdui-top-app-bar-title', flatten: true })
  private readonly titleElements!: TopAppBarTitle[];

  private readonly uniqueId = uniqueId();
  private readonly scrollEventName = `scroll._top_app_bar_${this.uniqueId}`;

  /**
   * 滚动条是否不位于顶部
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  private scrolling = false;

  /**
   * 顶部应用栏形状。可选值为：
   * * `center-aligned`
   * * `small`
   * * `medium`
   * * `large`
   */
  @property({ reflect: true })
  public variant:
    | 'center-aligned' /*预览图*/
    | 'small' /*预览图*/
    | 'medium' /*预览图*/
    | 'large' /*预览图*/ = 'small';

  /**
   * 是否隐藏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public hide = false;

  /**
   * 在页面向下滚动时，是否隐藏组件
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'hide-on-scroll',
  })
  public hideOnScroll = false;

  /**
   * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public shrink = false;

  /**
   * 是否在滚动到顶部时缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'shrink-on-scroll',
  })
  public shrinkOnScroll = false;

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
  private get scrollTargetListening(): HTMLElement | Window {
    return this.scrollTarget ? $(this.scrollTarget)[0] : window;
  }

  /**
   * 组件在该容器内滚动
   */
  private get scrollTargetContainer(): HTMLElement {
    return this.scrollTarget ? $(this.scrollTarget)[0] : document.body;
  }

  public override connectedCallback(): void {
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

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(this.scrollTargetListening).off(this.scrollEventName);
  }

  /**
   * scrollTarget 属性变更时，重新设置时间监听
   */
  @watch('scrollTarget')
  private onScrollTargetChange(
    oldScrollTarget: string,
    newScrollTarget: string,
  ) {
    $(oldScrollTarget ?? window).off(this.scrollEventName);
    $(newScrollTarget).on(this.scrollEventName, () => {
      window.requestAnimationFrame(() => this.onScroll());
    });
    this.onScroll();
  }

  @watch('variant')
  private async onVariantChange() {
    $(this).one('transitionend', () => {
      // variant 变更时，重新为 scrollTargetContainer 元素添加 padding-top。避免 top-app-bar 覆盖内容
      $(this.scrollTargetContainer).css({
        'padding-top': this.offsetHeight,
      });
    });

    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    this.titleElements.forEach((titleElement) => {
      titleElement.variant = this.variant;
    });
  }

  @watch('shrink')
  private async onShrinkChange() {
    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    this.titleElements.forEach((titleElement) => {
      titleElement.shrink = this.shrink;
    });
  }

  private lastScrollTop = 0; // 上次滚动后，垂直方向的距离。使用 scrollThreshold
  private lastScrollTopNoThreshold = 0; // 上次滚动后，垂直方向的距离。不使用 scrollThreshold
  private onScroll() {
    const scrollTop =
      (this.scrollTargetListening as Window).scrollY ||
      (this.scrollTargetListening as HTMLElement).scrollTop;
    this.scrolling = !!scrollTop;

    // 在向下滚动时，缩小；向上滚动到顶部时，复原。shrinkOnScroll 不应用 scrollThreshold 属性
    if (this.shrinkOnScroll) {
      if (scrollTop > this.lastScrollTop) {
        this.shrink = true;
      } else if (!scrollTop) {
        this.shrink = false;
      }

      this.lastScrollTopNoThreshold = scrollTop;
    }

    // hideOnScroll 要应用 scrollThreshold 属性
    if (
      Math.abs(scrollTop - this.lastScrollTop) <= (this.scrollThreshold || 0)
    ) {
      return;
    }

    if (this.hideOnScroll) {
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
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar': TopAppBar;
  }
}

import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { animate, AnimateController } from '@lit-labs/motion';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import {
  DURATION_MEDIUM_IN,
  DURATION_MEDIUM_OUT,
  EASING_LINEAR,
} from '@mdui/shared/helpers/motion.js';
import { when } from 'lit/directives/when.js';
import { topAppBarStyle } from './top-app-bar-style.js';
import { TopAppBarTitle } from './top-app-bar-title.js';

/**
 * @event show - 开始显示时，事件被触发
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发
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
  protected titleElements!: TopAppBarTitle[];

  protected readonly animateController = new AnimateController(this, {
    defaultOptions: {
      keyframeOptions: {
        duration: DURATION_MEDIUM_IN,
        easing: EASING_LINEAR,
      },
      in: [{ opacity: 0 }, { opacity: 0, offset: 0.4 }],
      out: [{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
    },
  });

  @property({ type: Boolean, reflect: true })
  protected scrolling = false;

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
  @property({ type: Boolean, reflect: true })
  public hide = false;

  /**
   * 在页面向下滚动时，是否隐藏组件
   */
  @property({ type: Boolean, reflect: true, attribute: 'hide-on-scroll' })
  public hideOnScroll = false;

  /**
   * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({ type: Boolean, reflect: true })
  public compact = false;

  /**
   * 是否在滚动到顶部时缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({ type: Boolean, reflect: true, attribute: 'compact-on-scroll' })
  public compactOnScroll = false;

  override connectedCallback() {
    super.connectedCallback();
    $(window).on('scroll._top_app_bar', () => {
      window.requestAnimationFrame(() => this.onWindowScroll());
    });
    $(this).on('transitionend', () => {
      emit(this, this.hide ? 'hidden' : 'shown');
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    $(window).off('scroll._top_app_bar');
  }

  private lastScrollY = 0; // 上次滚动后，垂直方向的距离
  protected onWindowScroll() {
    const pageYOffset = window.pageYOffset;
    this.scrolling = !!pageYOffset;

    if (this.hideOnScroll) {
      this.hide = pageYOffset > this.lastScrollY;
      emit(this, this.hide ? 'hide' : 'show');
    }

    // 在向下滚动时，缩小；向上滚动到顶部时，复原
    if (this.compactOnScroll) {
      if (pageYOffset > this.lastScrollY) {
        this.compact = true;
      } else if (!pageYOffset) {
        this.compact = false;
      }
    }

    if (this.hideOnScroll || this.compactOnScroll) {
      this.lastScrollY = pageYOffset;
    }
  }

  protected override render(): TemplateResult {
    const title = this.titleElements.length
      ? this.titleElements[0].textContent
      : null;

    return html`<slot></slot>${when(
        ['medium', 'large'].includes(this.variant) &&
          !this.compact &&
          !this.hide,
        () => html`<div
          part="large-title"
          class="large-title"
          ${animate({
            keyframeOptions: {
              duration: DURATION_MEDIUM_OUT,
              easing: EASING_LINEAR,
            },
          })}
        >
          <div part="large-title-inner" class="large-title-inner">${title}</div>
        </div>`,
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar': TopAppBar;
  }
}

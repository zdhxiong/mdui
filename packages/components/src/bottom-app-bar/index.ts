import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { style } from './style.js';

/**
 * @event show - 开始显示时，事件被触发
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 底部应用栏内部的元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-bottom-app-bar')
export class BottomAppBar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

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

  override connectedCallback() {
    super.connectedCallback();
    $(window).on('scroll._bottom_app_bar', () => {
      window.requestAnimationFrame(() => this.onWindowScroll());
    });
    $(this).on('transitionend', () => {
      emit(this, this.hide ? 'hidden' : 'shown');
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    $(window).off('scroll._bottom_app_bar');
  }

  private lastScrollY = 0; // 上次滚动后，垂直方向的距离
  protected onWindowScroll() {
    if (!this.hideOnScroll) {
      return;
    }

    this.hide = window.pageYOffset > this.lastScrollY;
    this.lastScrollY = window.pageYOffset;
    emit(this, this.hide ? 'hide' : 'show');
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

import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { when } from 'lit/directives/when.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event keydown - 聚焦状态下，按下按键时触发
 */
@customElement('mdui-card')
export class Card extends AnchorMixin(RippleMixin(FocusableMixin(LitElement))) {
  static override styles: CSSResultGroup = [componentStyle, style];

  protected get disabled() {
    return !this.href && !this.clickable;
  }

  @queryAll('.link')
  protected focusProxiedElements!: HTMLElement[];

  @query('mdui-ripple')
  protected rippleElement!: Ripple;

  /**
   * 卡片形状。可选值为：
   * * `elevated`
   * * `filled`
   * * `outlined`
   */
  @property({ reflect: true })
  public variant:
    | 'elevated' /*预览图*/
    | 'filled' /*预览图*/
    | 'outlined' /*预览图*/ = 'elevated';

  /**
   * 是否可点击。为 `true` 时，会添加鼠标悬浮效果、及点击涟漪效果
   */
  @property({ type: Boolean, reflect: true })
  public clickable = false;

  protected override render(): TemplateResult {
    const { href, clickable } = this;

    if (href) {
      // @ts-ignore
      return html`<mdui-ripple></mdui-ripple>${this.renderAnchor({
          className: 'link',
          content: html`<slot></slot>`,
        })}`;
    }

    return html`${when(clickable, () => html`<mdui-ripple></mdui-ripple>`)}<slot
      ></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-card': Card;
  }
}

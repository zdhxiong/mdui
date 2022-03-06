import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

/**
 * @event click - 点击时触发
 */
@customElement('mdui-card')
export class Card extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @property({ reflect: true })
  public variant: 'elevated' | 'filled' | 'outlined' = 'elevated';

  @property({ type: Boolean, reflect: true })
  public disabled = false;

  protected override render(): TemplateResult {
    return html`<mdui-ripple></mdui-ripple><slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-card': Card;
  }
}

import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { RippleMixin } from '../shared/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

@customElement('mdui-card')
export class Card extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  ripple!: Ripple;

  @property({ reflect: true })
  variant = 'elevated';

  protected override render(): TemplateResult {
    return html`<mdui-ripple></mdui-ripple>
      <div class="card"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-card': Card;
  }
}

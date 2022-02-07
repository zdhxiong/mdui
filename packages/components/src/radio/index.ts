import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { RippleMixin } from '../shared/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

@customElement('mdui-radio')
export class Radio extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  rippleElement!: Ripple;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean })
  autofocus = false;

  @property({ reflect: true })
  form!: string;

  @property({ reflect: true })
  name!: string;

  @property({ reflect: true })
  value = 'on';

  protected override render(): TemplateResult {
    const { disabled, checked, autofocus, name } = this;

    return html`<label>
      <input
        type="radio"
        name=${name}
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
      />
      <i>
        <mdui-ripple></mdui-ripple>
      </i>
      <slot></slot>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-radio': Radio;
  }
}

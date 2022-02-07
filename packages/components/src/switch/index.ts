import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { RippleMixin } from '../shared/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

@customElement('mdui-switch')
export class Switch extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = style;

  @query('mdui-ripple', true)
  ripple!: Ripple;

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
        type="checkbox"
        name=${name}
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
      />
      <i class="track"></i>
      <i class="handle">
        <mdui-ripple></mdui-ripple>
      </i>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

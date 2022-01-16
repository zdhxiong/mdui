import { LitElement, html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { style } from './style.js';

@customElement('mdui-card')
export class MduiCard extends LitElement {
  static override styles: CSSResultGroup = style;

  @property({ reflect: true })
  variant = 'elevated';

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-card': MduiCard;
  }
}

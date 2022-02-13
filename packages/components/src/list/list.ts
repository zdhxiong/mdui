import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { style } from './list-style.js';

@customElement('mdui-list')
export class List extends LitElement {
  static override styles: CSSResultGroup = style;

  @property({ type: Boolean, reflect: true })
  public divider = false;

  @property({ type: Boolean, reflect: true })
  public loading = false;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list': List;
  }
}

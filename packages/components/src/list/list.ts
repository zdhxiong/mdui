import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listStyle } from './list-style.js';

@customElement('mdui-list')
export class List extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, listStyle];

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

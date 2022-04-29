import { html, CSSResultGroup, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tableStyle } from './table-style.js';

@customElement('mdui-table')
export class Table extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, tableStyle];

  @property({ type: Boolean, reflect: true })
  public stripe = false;

  protected override render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-table': Table;
  }
}

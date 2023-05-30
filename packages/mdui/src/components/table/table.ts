import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tableStyle } from './table-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

@customElement('mdui-table')
export class Table extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, tableStyle];

  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
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

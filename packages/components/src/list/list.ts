import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listStyle } from './list-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - `<mdui-list-item>` 元素
 */
@customElement('mdui-list')
export class List extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, listStyle];

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list': List;
  }
}

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listSubheaderStyle } from './list-subheader-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 文本
 */
@customElement('mdui-list-subheader')
export class ListSubheader extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    listSubheaderStyle,
  ];

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list-subheader': ListSubheader;
  }
}

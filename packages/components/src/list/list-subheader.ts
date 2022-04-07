import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listSubheaderStyle } from './list-subheader-style.js';

/**
 * @slot - 文本
 */
@customElement('mdui-list-subheader')
export class ListSubheader extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, listSubheaderStyle];

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

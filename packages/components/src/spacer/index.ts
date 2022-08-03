import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';

/**
 * 用于在 flexbox 布局中，占据所有剩余空间
 */
@customElement('mdui-spacer')
export class Spacer extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  protected override render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-spacer': Spacer;
  }
}

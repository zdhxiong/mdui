import { html, CSSResultGroup, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';

@customElement('mdui-divider')
export class Divider extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否显示垂直分割线
   */
  @property({ type: Boolean, reflect: true })
  public vertical = false;

  protected override render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-divider': Divider;
  }
}

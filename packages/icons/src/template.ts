import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { style } from './style.js';

export class IconDelete extends LitElement {
  static override styles: CSSResultGroup = style;

  protected override render(): TemplateResult {
    return html`<span>{{svg}}</span>`;
  }
}

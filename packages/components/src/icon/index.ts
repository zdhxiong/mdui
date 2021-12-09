import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from '@mdui/shared/decorators.js';
import { style } from './style.js';

@customElement('mdui-icon')
export class MduiIcon extends LitElement {
  static styles = style;

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

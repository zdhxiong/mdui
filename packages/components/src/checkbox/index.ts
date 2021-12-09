import { html, css, LitElement, TemplateResult } from 'lit';
import { property, customElement } from '@mdui/shared/decorators.js';

@customElement('mdui-checkbox')
export class MduiCheckbox extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--mdui-button-text-color, #000);
    }
  `;

  @property({ type: String }) title = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment(): void {
    this.counter += 1;
  }

  render(): TemplateResult {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}

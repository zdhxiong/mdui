import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';

/**
 * @csspart indicator - 指示器
 */
@customElement('mdui-linear-progress')
export class LinearProgress extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  @property({ type: Number, reflect: true })
  public max!: number;

  @property({ type: Number, reflect: true })
  public value!: number;

  protected override render(): TemplateResult {
    const { max, value } = this;
    const isDeterminate = value !== undefined;

    return html`<div
      part="indicator"
      class="${classMap({
        determinate: isDeterminate,
        indeterminate: !isDeterminate,
      })}"
      style="${styleMap({
        width: isDeterminate
          ? `${(value / Math.max(max ?? value, value)) * 100}%`
          : undefined,
      })}"
    ></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-linear-progress': LinearProgress;
  }
}

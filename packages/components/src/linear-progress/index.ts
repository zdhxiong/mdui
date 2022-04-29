import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';

/**
 * @csspart indicator - 指示器
 */
@customElement('mdui-linear-progress')
export class LinearProgress extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 进度指示器的最大值
   */
  @property({ type: Number, reflect: true })
  public max!: number;

  /**
   * 进度指示器的当前值。若未指定该值，则为不确定状态
   */
  @property({ type: Number, reflect: true })
  public value!: number;

  protected override render(): TemplateResult {
    const { max, value } = this;
    const isDeterminate = value !== undefined;

    if (isDeterminate) {
      return html`<div
        part="indicator"
        class="determinate"
        style="${styleMap({
          width: `${(value / Math.max(max ?? value, value)) * 100}%`,
        })}"
      ></div>`;
    }

    return html`<div part="indicator" class="indeterminate"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-linear-progress': LinearProgress;
  }
}

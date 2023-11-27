import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 圆形进度指示器组件
 *
 * ```html
 * <mdui-circular-progress></mdui-circular-progress>
 * ```
 */
@customElement('mdui-circular-progress')
export class CircularProgress extends MduiElement<CircularProgressEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 进度指示器的最大值，默认为 1
   */
  @property({ type: Number, reflect: true })
  public max = 1;

  /**
   * 进度指示器的当前值。若未指定该值，则为不确定状态
   */
  @property({ type: Number })
  public value?: number;

  protected override render(): TemplateResult {
    const isDeterminate = !isUndefined(this.value);

    return html`<div
      class="progress ${classMap({
        determinate: isDeterminate,
        indeterminate: !isDeterminate,
      })}"
    >
      ${isDeterminate ? this.renderDeterminate() : this.renderInDeterminate()}
    </div>`;
  }

  private renderDeterminate(): TemplateResult {
    const value = this.value!;
    const strokeWidth = 4; // 圆环宽度
    const circleRadius = 18; // 圆环宽度中心点的半径
    const π = 3.1415926;
    const center = circleRadius + strokeWidth / 2;
    const circumference = 2 * π * circleRadius;
    const determinateStrokeDashOffset =
      (1 - value / Math.max(this.max ?? value, value)) * circumference;

    return html`<svg viewBox="0 0 ${center * 2} ${center * 2}">
      <circle
        class="track"
        cx="${center}"
        cy="${center}"
        r="${circleRadius}"
        stroke-width="${strokeWidth}"
      ></circle>
      <circle
        class="circle"
        cx="${center}"
        cy="${center}"
        r="${circleRadius}"
        stroke-dasharray="${2 * π * circleRadius}"
        stroke-dashoffset="${determinateStrokeDashOffset}"
        stroke-width="${strokeWidth}"
      ></circle>
    </svg>`;
  }

  private renderInDeterminate(): TemplateResult {
    const strokeWidth = 4; // 圆环宽度
    const circleRadius = 18; // 圆环宽度中心点的半径
    const π = 3.1415926;
    const center = circleRadius + strokeWidth / 2;
    const circumference = 2 * π * circleRadius;
    const halfCircumference = 0.5 * circumference;

    const circle = (thisStrokeWidth: number) =>
      html`<svg class="circle" viewBox="0 0 ${center * 2} ${center * 2}">
        <circle
          cx="${center}"
          cy="${center}"
          r="${circleRadius}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${halfCircumference}"
          stroke-width="${thisStrokeWidth}"
        ></circle>
      </svg>`;

    return html`<div class="layer">
      <div class="clipper left">${circle(strokeWidth)}</div>
      <div class="gap-patch">${circle(strokeWidth * 0.8)}</div>
      <div class="clipper right">${circle(strokeWidth)}</div>
    </div>`;
  }
}

export interface CircularProgressEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-circular-progress': CircularProgress;
  }
}

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 线性进度指示器组件
 *
 * ```html
 * <mdui-linear-progress></mdui-linear-progress>
 * ```
 *
 * @csspart indicator - 指示器
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-linear-progress')
export class LinearProgress extends LitElement {
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

    if (isDeterminate) {
      const value = this.value!;

      return html`<div
        part="indicator"
        class="determinate"
        style="${styleMap({
          width: `${(value / Math.max(this.max ?? value, value)) * 100}%`,
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

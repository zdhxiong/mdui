import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
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
 * @csspart indicator - 指示器部分
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-linear-progress')
export class LinearProgress extends MduiElement<LinearProgressEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 进度指示器的最大值。默认为 `1`
   */
  @property({ type: Number, reflect: true })
  public max = 1;

  /**
   * 进度指示器的当前值。如果未指定该值，则处于不确定状态
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

export interface LinearProgressEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-linear-progress': LinearProgress;
  }
}

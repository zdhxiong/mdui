import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 徽标组件
 *
 * ```html
 * <mdui-badge>12</mdui-badge>
 * ```
 *
 * @slot - 显示的文本
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-badge')
export class Badge extends MduiElement<BadgeEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 徽标形状。可选值为：
   * * `small`：小型徽标，不显示文字
   * * `large`：大型徽标，会显示文字
   */
  @property({ reflect: true })
  public variant:
    | /*小型徽标，不显示文字*/ 'small'
    | /*大型徽标，会显示文字*/ 'large' = 'large';

  protected override render(): TemplateResult {
    if (this.variant === 'small') {
      return nothingTemplate;
    }

    return html`<slot></slot>`;
  }
}

export interface BadgeEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-badge': Badge;
  }
}

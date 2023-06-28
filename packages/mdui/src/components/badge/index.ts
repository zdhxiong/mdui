import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 显示的文本
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-badge')
export class Badge extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 徽标形状。可选值为：
   * * `small`
   * * `large`
   */
  @property({ reflect: true })
  public variant: 'small' | 'large' = 'large';

  protected override render(): TemplateResult {
    if (this.variant === 'small') {
      return nothingTemplate;
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-badge': Badge;
  }
}

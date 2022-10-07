import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 显示的文本
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-badge')
export class Badge extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否显示为小圆点
   */
  @property({ type: Boolean, reflect: true })
  public dot = false;

  protected override render(): TemplateResult | typeof nothing {
    if (this.dot) {
      return nothing;
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-badge': Badge;
  }
}

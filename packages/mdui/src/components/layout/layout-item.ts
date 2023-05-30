import { CSSResultGroup, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from './layout-item-base.js';
import { layoutItemStyle } from './layout-item-style.js';
import type { LayoutPlacement } from './helper.js';
import type { TemplateResult } from 'lit';

/**
 * @slot - 可以是任意内容
 */
@customElement('mdui-layout-item')
export class LayoutItem extends LayoutItemBase {
  public static override styles: CSSResultGroup = [
    componentStyle,
    layoutItemStyle,
  ];

  /**
   * 该组件所处位置。可选值为：
   * * `top`：位于上方
   * * `bottom`：位于下方
   * * `left`：位于左侧
   * * `right`：位于右侧
   */
  @property({ reflect: true })
  public placement:
    | 'top' /*位于上方*/
    | 'bottom' /*位于下方*/
    | 'left' /*位于左侧*/
    | 'right' /*位于右侧*/ = 'top';

  protected override get layoutPlacement(): LayoutPlacement {
    return this.placement;
  }

  // placement 变更时，需要重新调整布局
  @watch('placement', true)
  private onPlacementChange() {
    this.layoutManager?.updateLayout(this);
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout-item': LayoutItem;
  }
}

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from './layout-item-base.js';
import { layoutItemStyle } from './layout-item-style.js';
import type { LayoutPlacement } from './helper.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 布局项组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以包含任意内容
 */
@customElement('mdui-layout-item')
export class LayoutItem extends LayoutItemBase<LayoutItemEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    layoutItemStyle,
  ];

  /**
   * 组件的位置。可选值包括：
   *
   * * `top`：上方
   * * `bottom`：下方
   * * `left`：左侧
   * * `right`：右侧
   */
  @property({ reflect: true })
  public placement:
    | /*上方*/ 'top'
    | /*下方*/ 'bottom'
    | /*左侧*/ 'left'
    | /*右侧*/ 'right' = 'top';

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

export interface LayoutItemEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout-item': LayoutItem;
  }
}

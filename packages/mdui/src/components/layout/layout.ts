import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { layoutStyle } from './layout-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 布局组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以是 [`<mdui-top-app-bar>`](/docs/2/components/top-app-bar)、[`<mdui-bottom-app-bar>`](/docs/2/components/bottom-app-bar)、[`<mdui-navigation-bar>`](/docs/2/components/navigation-bar)、[`<mdui-navigation-drawer>`](/docs/2/components/navigation-drawer)、[`<mdui-navigation-rail>`](/docs/2/components/navigation-rail)、`<mdui-layout-item>`、`<mdui-layout-main>` 元素
 */
@customElement('mdui-layout')
export class Layout extends MduiElement<LayoutEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, layoutStyle];

  /**
   * 把当前布局的高度设为 100%
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'full-height',
  })
  public fullHeight = false;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

export interface LayoutEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout': Layout;
  }
}

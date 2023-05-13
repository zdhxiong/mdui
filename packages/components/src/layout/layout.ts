import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { layoutStyle } from './layout-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 可以是 `<mdui-top-app-bar>`、`<mdui-bottom-app-bar>`、`<mdui-navigation-bar>`、`<mdui-navigation-drawer>`、`<mdui-navigation-rail>`、`<mdui-layout-item>`、`<mdui-layout-main>` 元素
 */
@customElement('mdui-layout')
export class Layout extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, layoutStyle];

  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public fullheight = false;

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout': Layout;
  }
}

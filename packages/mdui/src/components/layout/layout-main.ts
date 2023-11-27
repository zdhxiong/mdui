import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { getLayout, LayoutManager } from './helper.js';
import { layoutMainStyle } from './layout-main-style.js';
import type { Layout } from './layout.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 布局主内容组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以是任意内容
 */
@customElement('mdui-layout-main')
export class LayoutMain extends MduiElement<LayoutMainEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    layoutMainStyle,
  ];

  private layoutManager?: LayoutManager;

  public override connectedCallback(): void {
    super.connectedCallback();

    const parentElement = this.parentElement! as Layout;
    if (isNodeName(parentElement, 'mdui-layout')) {
      this.layoutManager = getLayout(parentElement);
      this.layoutManager.registerMain(this);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.layoutManager) {
      this.layoutManager.unregisterMain();
    }
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

export interface LayoutMainEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout-main': LayoutMain;
  }
}

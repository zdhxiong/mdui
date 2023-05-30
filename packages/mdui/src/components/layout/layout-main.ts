import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { getLayout, LayoutManager } from './helper.js';
import { layoutMainStyle } from './layout-main-style.js';
import type { Layout } from './layout.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @slot - 可以是任意内容
 */
@customElement('mdui-layout-main')
export class LayoutMain extends LitElement {
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

declare global {
  interface HTMLElementTagNameMap {
    'mdui-layout-main': LayoutMain;
  }
}

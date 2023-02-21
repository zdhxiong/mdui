import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { layoutStyle } from './layout-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

@customElement('mdui-layout')
export class Layout extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, layoutStyle];

  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
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

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

@customElement('mdui-divider')
export class Divider extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否显示垂直分割线
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public vertical = false;

  /**
   * 是否左侧缩进
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public inset = false;

  /**
   * 是否左右两侧缩进
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public middle = false;

  protected override render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-divider': Divider;
  }
}

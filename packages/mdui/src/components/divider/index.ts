import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 分割线组件
 *
 * ```html
 * <mdui-divider></mdui-divider>
 * ```
 */
@customElement('mdui-divider')
export class Divider extends MduiElement<DividerEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否显示垂直分割线
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public vertical = false;

  /**
   * 是否左侧缩进
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public inset = false;

  /**
   * 是否左右两侧缩进
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public middle = false;

  protected override render(): TemplateResult {
    return html``;
  }
}

export interface DividerEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-divider': Divider;
  }
}

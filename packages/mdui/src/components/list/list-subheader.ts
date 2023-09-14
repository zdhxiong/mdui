import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listSubheaderStyle } from './list-subheader-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 列表标题组件。需与 `<mdui-list>` 组件配合使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @slot - 文本
 */
@customElement('mdui-list-subheader')
export class ListSubheader extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    listSubheaderStyle,
  ];

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list-subheader': ListSubheader;
  }
}

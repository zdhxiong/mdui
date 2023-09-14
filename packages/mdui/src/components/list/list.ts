import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listStyle } from './list-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 列表组件。需与 `<mdui-list-item>` 组件配合使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @slot - `<mdui-list-item>` 元素
 */
@customElement('mdui-list')
export class List extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, listStyle];

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list': List;
  }
}

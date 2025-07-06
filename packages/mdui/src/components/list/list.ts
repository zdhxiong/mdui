import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/attr.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listStyle } from './list-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 列表组件。需配合 `<mdui-list-item>` 组件使用
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
export class List extends MduiElement<ListEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, listStyle];

  /**
   * 用于描述组件的无障碍标签。它将应用到 `aria-label`，但不会在界面上显示
   */
  @property({ reflect: true })
  public label?: string;

  @watch('label')
  private onLabelChange() {
    $(this).attr('aria-label', this.label || null);
  }

  public override connectedCallback() {
    super.connectedCallback();

    this.setAttribute('role', 'list');
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

export interface ListEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list': List;
  }
}

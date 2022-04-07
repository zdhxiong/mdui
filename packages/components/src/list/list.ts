import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ListItem } from './list-item.js';
import { listStyle } from './list-style.js';

@customElement('mdui-list')
export class List extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, listStyle];

  @queryAssignedElements({ selector: 'mdui-list-item', flatten: true })
  protected itemElements!: ListItem[] | null;

  /**
   * 是否使所有列表项都不可点击，但其中的 checkbox、radio、switch 等仍可进行交互
   */
  @property({ type: Boolean, reflect: true })
  public nonclickable = false;

  /**
   * 是否所有列表项都使用圆角形状
   */
  @property({ type: Boolean, reflect: true })
  public rounded = false;

  @watch('rounded')
  @watch('nonclickable')
  private onSlotChange() {
    const itemElements = this.itemElements ?? [];

    itemElements.forEach((itemElement) => {
      itemElement.rounded = this.rounded;
      itemElement.nonclickable = this.nonclickable;
    });
  }

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-list': List;
  }
}

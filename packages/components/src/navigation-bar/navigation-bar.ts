import { customElement } from 'lit/decorators/custom-element.js';
import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js';
import { style } from './navigation-bar-style.js';
import { NavigationBarItem } from './navigation-bar-item.js';

@customElement('mdui-navigation-bar')
export class NavigationBar extends LitElement {
  static override styles: CSSResultGroup = style;

  @queryAssignedElements({ flatten: true })
  protected itemElements!: NavigationBarItem[] | null;

  @property({ type: Boolean, reflect: true })
  public hideOnScroll = false;

  @property({ reflect: true })
  public labelVisibility = 'auto';

  private _value = '';

  @property({ reflect: true })
  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    const oldValue = this.value;
    if (value === oldValue) {
      return;
    }

    this._value = value;
    this.updateComplete.then(() => {
      const itemElement = this.itemElements?.find(
        (itemElement) => itemElement.value === value,
      );
      if (itemElement) {
        this.selectItem(itemElement);
      }
    });
    this.requestUpdate('value', oldValue);
  }

  public constructor() {
    super();

    this.addEventListener('click', this.onClick);
  }

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`;
  }

  private onClick(event: Event): void {
    const item = event
      .composedPath()
      .find(
        (el) => (el as NavigationBarItem).parentElement === this,
      ) as NavigationBarItem;

    if (!item) {
      return;
    }

    this.selectItem(item);
  }

  private selectItem(item: NavigationBarItem): void {
    const value = item.getAttribute('value');
    if (!value) {
      return;
    }
    const oldValue = this.value;
    this.value = value;

    const applyDefault = this.dispatchEvent(
      new Event('change', { cancelable: true }),
    );
    if (!applyDefault) {
      this.value = oldValue;
    } else {
      (this.itemElements ?? []).forEach((itemElement) => {
        itemElement.active = itemElement.value === value;
      });
    }
  }

  protected onSlotChange() {
    const itemElements = this.itemElements ?? [];

    // 为 navigation-bar-item 设置 labelVisibility 属性
    const labelVisibility =
      this.labelVisibility === 'auto'
        ? itemElements.length <= 3
          ? 'labeled'
          : 'selected'
        : this.labelVisibility;

    itemElements.forEach((itemElement) => {
      itemElement.labelVisibility = labelVisibility;
    });

    // 为 navigation-bar-item 的 value 填充默认值
    itemElements.forEach((itemElement, index) => {
      if (!itemElement.value) {
        itemElement.value = index.toString();
      }
    });

    // 未设置 navigation-bar 的 value 属性时，根据 navigation-bar-item 的 active 来设置
    if (!this.value) {
      this.value =
        itemElements.find((itemElement) => itemElement.active)?.value ?? '';
    }

    // 未设置 navigation-bar 的 value，也未设置 navigation-bar-item 的 active，则默认选中第一个
    if (!this.value) {
      this.value = itemElements[0].value;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar': NavigationBar;
  }
}

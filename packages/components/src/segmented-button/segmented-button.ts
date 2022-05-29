import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { segmentedButtonStyle } from './segmented-button-style.js';
import { SegmentedButtonItem } from './segmented-button-item.js';

/**
 * @event click - 点击时触发
 * @event change - 选中的值变更时触发
 *
 * @slot - `<mdui-segmented-button-item>` 组件
 *
 * @csspart --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-segmented-button')
export class SegmentedButton extends LitElement {
  static override styles: CSSResultGroup = [
    componentStyle,
    segmentedButtonStyle,
  ];

  @queryAssignedElements({
    selector: 'mdui-segmented-button-item',
    flatten: true,
  })
  protected itemElements!: SegmentedButtonItem[] | null;

  @query('select', true)
  protected inputElement!: HTMLSelectElement;

  protected readonly formController: FormController = new FormController(this);

  /**
   * 是否验证未通过
   */
  @state()
  protected invalid = false;

  /**
   * 是否填满父元素宽度
   */
  @property({ type: Boolean, reflect: true })
  public fullwidth = false;

  /**
   * 分段按钮的可选中黄台。默认为不可选中。可选值为：
   * * `single`：最多只能选中一个
   * * `multiple`：可以选中多个
   */
  @property({ reflect: true })
  public selects!:
    | undefined
    | 'single' /*分段按钮项为单选*/
    | 'multiple' /*分段按钮项为多选*/;

  /**
   * 提交表单时，是否必须选中
   */
  @property({ type: Boolean, reflect: true })
  public required = false;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form!: string;

  /**
   * 提交表单时的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  private _value = '';

  /**
   * 当前选中的 `<mdui-segmented-button-item>` 的值。若为多选，则多个值会用 `,` 分隔
   */
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

    if (!this.hasUpdated) {
      this.updateComplete.then(() => this.selectItems());
      this.requestUpdate('value', oldValue);
    } else {
      this.selectItems();
    }
  }

  public constructor() {
    super();

    this.addEventListener('click', this.onClick);
  }

  protected override render(): TemplateResult {
    return html`<slot @slotchange=${this.onSlotChange}></slot>
      ${when(
        this.selects,
        () => html`<select .required=${this.required}>
          <option value=""></option>
          ${when(
            this.value,
            () => html`<option selected value=${this.value}></option>`,
          )}
        </select>`,
      )} `;
  }

  protected onClick(event: Event): void {
    if (!this.selects) {
      return;
    }

    const item = event
      .composedPath()
      .find(
        (el) => (el as SegmentedButtonItem).parentElement === this,
      ) as SegmentedButtonItem;

    if (!item) {
      return;
    }

    let selectedItems = [];
    if (this.selects === 'single') {
      selectedItems = item.selected ? [] : [item];
    } else {
      selectedItems = (this.itemElements ?? []).filter((itemElement) => {
        return (
          (itemElement.selected && itemElement !== item) ||
          (!itemElement.selected && itemElement === item)
        );
      });
    }

    this.value = selectedItems
      .map((itemElement) => itemElement.value)
      .join(',');
  }

  /**
   * 选中当前 value 对应的 items
   */
  protected selectItems(): void {
    if (!this.selects) {
      return;
    }

    emit(this, 'change');

    const isMultiple = this.selects === 'multiple';
    const valueArr = isMultiple ? this.value.split(',') : [this.value];

    let selectedItems = (this.itemElements ?? []).filter((itemElement) =>
      valueArr.includes(itemElement.value!),
    );
    if (!isMultiple) {
      selectedItems = selectedItems.slice(-1);
    }
    (this.itemElements ?? []).forEach((itemElement) => {
      itemElement.selected = selectedItems.includes(itemElement);
    });
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
    return this.inputElement.checkValidity();
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.inputElement.reportValidity();
    return !this.invalid;
  }

  /**
   * 设置验证未通过时的提示文字
   *
   * @param message 验证未通过时的提示文字
   */
  public setCustomValidity(message: string): void {
    this.inputElement.setCustomValidity(message);
  }

  protected onSlotChange() {
    const itemElements = this.itemElements ?? [];

    itemElements.forEach((itemElement, index) => {
      itemElement.classList.toggle(
        'mdui-segmented-button-item-first',
        index === 0,
      );
      itemElement.classList.toggle(
        'mdui-segmented-button-item-last',
        index === itemElements.length - 1,
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-segmented-button': SegmentedButton;
  }
}

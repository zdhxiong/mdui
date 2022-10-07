import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { isString } from '@mdui/jq/shared/helper.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { segmentedButtonStyle } from './segmented-button-style.js';
import type { SegmentedButtonItem as SegmentedButtonItemOriginal } from './segmented-button-item.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type SegmentedButtonItem = SegmentedButtonItemOriginal & {
  selected: boolean;
  readonly key: number;
};

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

  // 所有的子项元素
  protected get items() {
    return $(this)
      .find('mdui-segmented-button-item')
      .get() as unknown as SegmentedButtonItem[];
  }

  // 所有的子项元素（不包含已禁用的）
  protected get itemsEnabled() {
    return $(this)
      .find('mdui-segmented-button-item:not([disabled])')
      .get() as unknown as SegmentedButtonItem[];
  }

  @query('select', true)
  protected input!: HTMLSelectElement;

  protected readonly formController: FormController = new FormController(this);

  // 是否为单选
  protected get isSingle() {
    return this.selects === 'single';
  }

  // 是否为多选
  protected get isMultiple() {
    return this.selects === 'multiple';
  }

  // 是否可选择
  protected get isSelectable() {
    return this.isSingle || this.isMultiple;
  }

  // 因为 segmented-button-item 的 value 可能会重复，所以在每个 segmented-button-item 元素上都加了一个唯一的 key 属性，通过 selectedKeys 来记录选中状态的 key
  @state() private selectedKeys: number[] = [];

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

  /**
   * 当前选中的 `<mdui-segmented-button-item>` 的值
   *
   * Note:
   * 该属性的 HTML 属性始终为字符串，且仅在 `selects="single"` 时可以通过 HTML 属性设置初始值
   * 该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。
   * 所以，在 `selects="multiple"` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property()
  public value: string | string[] = '';

  @watch('selects')
  private onSelectsChange() {
    if (!this.isSelectable && this.selectedKeys.length) {
      this.selectedKeys = [];
      this.onSelectedKeysChange();
      this.onValueChange();
    }

    if (this.isSingle && this.selectedKeys.length > 1) {
      this.selectedKeys = this.selectedKeys.slice(0, 1);
      this.onSelectedKeysChange();
      this.onValueChange();
    }
  }

  @watch('selectedKeys')
  private onSelectedKeysChange() {
    // 根据 selectedKeys 读取出对应 segmented-button-item 的 value
    const values = this.itemsEnabled
      .filter((item) => this.selectedKeys.includes(item.key))
      .map((item) => item.value);
    this.value = this.isMultiple ? values : values[0];

    emit(this, 'change');
  }

  @watch('value')
  private onValueChange() {
    // 根据 value 找出对应的 segmented-button-item，并把这些元素的 key 赋值给 selectedKeys
    if (!this.isSelectable) {
      this.updateSelected();
      return;
    }

    const values = (
      this.isSingle
        ? [this.value as string]
        : // 多选时，传入的值可能是字符串（通过 attribute 属性设置）；或字符串数组（通过 property 属性设置）
        isString(this.value)
        ? [this.value]
        : this.value
    ).filter((i) => i);

    if (!values.length) {
      this.selectedKeys = [];
    } else if (this.isSingle) {
      const firstItem = this.itemsEnabled.find(
        (item) => item.value === values[0],
      );
      this.selectedKeys = firstItem ? [firstItem.key] : [];
    } else if (this.isMultiple) {
      this.selectedKeys = this.itemsEnabled
        .filter((item) => values.includes(item.value))
        .map((item) => item.key);
    }

    this.updateSelected();
  }

  protected updateSelected() {
    this.items.forEach(
      (item) => (item.selected = this.selectedKeys.includes(item.key)),
    );
  }

  // 切换一个元素的选中状态
  private selectOne(item: SegmentedButtonItem) {
    if (this.isMultiple) {
      // 直接修改 this.selectedKeys 无法被 watch 监听到，需要先克隆一份 this.selectedKeys
      const selectedKeys = [...this.selectedKeys];
      if (selectedKeys.includes(item.key)) {
        selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
      } else {
        selectedKeys.push(item.key);
      }
      this.selectedKeys = selectedKeys;
    }

    if (this.isSingle) {
      if (this.selectedKeys.includes(item.key)) {
        this.selectedKeys = [];
      } else {
        this.selectedKeys = [item.key];
      }
    }

    this.updateSelected();
  }

  protected onClick(event: MouseEvent) {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest(
      'mdui-segmented-button-item',
    ) as SegmentedButtonItem;

    if (item.disabled) {
      return;
    }

    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
    return this.input.checkValidity();
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.input.reportValidity();
    return !this.invalid;
  }

  /**
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string): void {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  protected onSlotChange() {
    const items = this.items;

    items.forEach((item, index) => {
      item.classList.toggle('mdui-segmented-button-item-first', index === 0);
      item.classList.toggle(
        'mdui-segmented-button-item-last',
        index === items.length - 1,
      );
    });
  }

  protected override render(): TemplateResult {
    return html`<slot
        @slotchange=${this.onSlotChange}
        @click=${this.onClick}
      ></slot>
      ${when(
        this.isSelectable,
        () => html`<select .required=${this.required} tabindex="-1">
          <option value=""></option>
          ${when(
            this.value,
            () => html`<option selected value=${this.value}></option>`,
          )}
        </select>`,
      )} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-segmented-button': SegmentedButton;
  }
}

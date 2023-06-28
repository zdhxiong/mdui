import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { isString } from '@mdui/jq/shared/helper.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { segmentedButtonGroupStyle } from './segmented-button-group-style.js';
import type { SegmentedButton as SegmentedButtonOriginal } from './segmented-button.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

type SegmentedButton = SegmentedButtonOriginal & {
  selected: boolean;
  invalid: boolean;
  groupDisabled: boolean;
  readonly key: number;
};

/**
 * @event click - 点击时触发
 * @event change - 选中的值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - `<mdui-segmented-button>` 组件
 *
 * @csspart --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-segmented-button-group')
export class SegmentedButtonGroup extends LitElement implements FormControl {
  public static override styles: CSSResultGroup = [
    componentStyle,
    segmentedButtonGroupStyle,
  ];

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public fullwidth = false;

  /**
   * 分段按钮的可选中黄台。默认为不可选中。可选值为：
   * * `single`：最多只能选中一个
   * * `multiple`：可以选中多个
   */
  @property({ reflect: true })
  public selects?:
    | 'single' /*分段按钮项为单选*/
    | 'multiple' /*分段按钮项为多选*/;

  /**
   * 是否为禁用状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 提交表单时，是否必须选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public required = false;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form?: string;

  /**
   * 提交表单时的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 当前选中的 `<mdui-segmented-button>` 的值
   *
   * Note:
   * 该属性的 HTML 属性始终为字符串，且仅在 `selects="single"` 时可以通过 HTML 属性设置初始值
   * 该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。
   * 所以，在 `selects="multiple"` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property()
  public value: string | string[] = '';

  /**
   * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue()
  public defaultValue: string | string[] = '';

  // 因为 segmented-button 的 value 可能会重复，所以在每个 segmented-button 元素上都加了一个唯一的 key 属性，通过 selectedKeys 来记录选中状态的 key
  @state()
  private selectedKeys: number[] = [];

  /**
   * 是否验证未通过
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private invalid = false;

  // 是否已完成初始 value 的设置。首次设置初始值时，不触发 change 事件
  private hasSetDefaultValue = false;

  private readonly inputRef: Ref<HTMLSelectElement> = createRef();
  private readonly formController: FormController = new FormController(this);

  /**
   * 表单验证状态对象
   */
  public get validity(): ValidityState {
    return this.inputRef.value!.validity;
  }

  /**
   * 表单验证的错误提示信息
   */
  public get validationMessage(): string {
    return this.inputRef.value!.validationMessage;
  }

  // 所有的子项元素
  private get items() {
    return $(this)
      .find('mdui-segmented-button')
      .get() as unknown as SegmentedButton[];
  }

  // 所有的子项元素（不包含已禁用的）
  private get itemsEnabled() {
    return $(this)
      .find('mdui-segmented-button:not([disabled])')
      .get() as unknown as SegmentedButton[];
  }

  // 是否为单选
  private get isSingle() {
    return this.selects === 'single';
  }

  // 是否为多选
  private get isMultiple() {
    return this.selects === 'multiple';
  }

  // 是否可选择
  private get isSelectable() {
    return this.isSingle || this.isMultiple;
  }

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

  @watch('selectedKeys', true)
  private onSelectedKeysChange() {
    // 根据 selectedKeys 读取出对应 segmented-button 的 value
    const values = this.itemsEnabled
      .filter((item) => this.selectedKeys.includes(item.key))
      .map((item) => item.value);
    this.value = this.isMultiple ? values : values[0] || '';

    if (this.hasSetDefaultValue) {
      emit(this, 'change');
    } else {
      this.hasSetDefaultValue = true;
    }
  }

  @watch('value')
  private async onValueChange() {
    const hasUpdated = this.hasUpdated;

    if (!hasUpdated) {
      await this.updateComplete;
    }

    // 根据 value 找出对应的 segmented-button，并把这些元素的 key 赋值给 selectedKeys
    if (!this.isSelectable) {
      this.updateSelected(hasUpdated);
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

    this.updateSelected(hasUpdated);
  }

  @watch('invalid')
  private onInvalidChange() {
    this.itemsEnabled.forEach((item) => (item.invalid = this.invalid));
  }

  @watch('disabled')
  private onDisabledChange() {
    this.items.forEach((item) => (item.groupDisabled = this.disabled));
  }

  public override connectedCallback() {
    super.connectedCallback();

    this.value =
      this.isMultiple && isString(this.value)
        ? this.value
          ? [this.value]
          : []
        : this.value;
    this.defaultValue = this.selects === 'multiple' ? [] : '';
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
    const valid = this.inputRef.value!.checkValidity();

    if (!valid) {
      emit(this, 'invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });
    }

    return valid;
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.inputRef.value!.reportValidity();

    if (this.invalid) {
      const requestInvalid = emit(this, 'invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });

      // 调用了 preventDefault() 时，隐藏默认的表单错误提示
      if (requestInvalid.defaultPrevented) {
        this.inputRef.value!.blur();
        this.inputRef.value!.focus();
      }
    }

    return !this.invalid;
  }

  /**
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string): void {
    this.inputRef.value!.setCustomValidity(message);
    this.invalid = !this.inputRef.value!.checkValidity();
  }

  protected override render(): TemplateResult {
    return html`${when(
        this.isSelectable && this.isSingle,
        () =>
          html`<input
            ${ref(this.inputRef)}
            type="radio"
            name=${ifDefined(this.name)}
            value="1"
            .disabled=${this.disabled}
            .required=${this.required}
            .checked=${!!this.value}
            tabindex="-1"
            @keydown=${this.onInputKeyDown}
          />`,
      )}${when(
        this.isSelectable && this.isMultiple,
        () =>
          html`<select
            ${ref(this.inputRef)}
            name=${ifDefined(this.name)}
            .disabled=${this.disabled}
            .required=${this.required}
            multiple
            tabindex="-1"
            @keydown=${this.onInputKeyDown}
          >
            ${map(
              this.value,
              (value) => html`<option selected value=${value}></option>`,
            )}
          </select>`,
      )}<slot @slotchange=${this.onSlotChange} @click=${this.onClick}></slot>`;
  }

  private async updateSelected(hasUpdated: boolean) {
    this.items.forEach(
      (item) => (item.selected = this.selectedKeys.includes(item.key)),
    );

    if (hasUpdated) {
      await this.updateComplete;

      // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
      const form = this.formController.getForm();
      if (form && formResets.get(form)?.has(this)) {
        this.invalid = false;
        formResets.get(form)!.delete(this);
      } else {
        this.invalid = !this.inputRef.value!.checkValidity();
      }
    }
  }

  // 切换一个元素的选中状态
  private selectOne(item: SegmentedButton) {
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

    this.updateSelected(this.hasUpdated);
  }

  private onClick(event: MouseEvent) {
    // event.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (event.button) {
      return;
    }

    const target = event.target as HTMLElement;
    const item = target.closest('mdui-segmented-button') as SegmentedButton;

    if (item.disabled) {
      return;
    }

    if (this.isSelectable && item.value) {
      this.selectOne(item);
    }
  }

  /**
   * 在隐藏的 `<input>` 或 `<select>` 上按下按键时，切换选中状态
   */
  private onInputKeyDown(event: KeyboardEvent) {
    if (!['Enter', ' '].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (this.isSingle) {
      const input = event.target as HTMLInputElement;
      input.checked = !input.checked;
      this.selectOne(this.itemsEnabled[0]);
      this.itemsEnabled[0].focus();
    }

    if (this.isMultiple) {
      this.selectOne(this.itemsEnabled[0]);
      this.itemsEnabled[0].focus();
    }
  }

  private onSlotChange() {
    const items = this.items;

    items.forEach((item, index) => {
      item.classList.toggle('mdui-segmented-button-first', index === 0);
      item.classList.toggle(
        'mdui-segmented-button-last',
        index === items.length - 1,
      );
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-segmented-button-group': SegmentedButtonGroup;
  }
}

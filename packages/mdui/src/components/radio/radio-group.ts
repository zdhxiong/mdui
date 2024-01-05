import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/closest.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { radioGroupStyle } from './radio-group-style.js';
import type { Radio as RadioOriginal } from './radio.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

type Radio = RadioOriginal & {
  invalid: boolean;
  focusable: boolean;
  groupDisabled: boolean;
  isInitial: boolean;
};

/**
 * @summary 单选框组组件。需与 `<mdui-radio>` 组件配合使用
 *
 * ```html
 * <mdui-radio-group value="chinese">
 * ..<mdui-radio value="chinese">Chinese</mdui-radio>
 * ..<mdui-radio value="english">English</mdui-radio>
 * </mdui-radio-group>
 * ```
 *
 * @event change - 选中值变化时触发
 * @event input - 选中值变化时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - `<mdui-radio>` 元素
 */
@customElement('mdui-radio-group')
export class RadioGroup
  extends MduiElement<RadioGroupEventMap>
  implements FormControl
{
  public static override styles: CSSResultGroup = [
    componentStyle,
    radioGroupStyle,
  ];

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
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form?: string;

  /**
   * 单选框名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 单选框的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue()
  public defaultValue = '';

  /**
   * 提交表单时，是否必须选中其中一个单选框
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public required = false;

  /**
   * 是否验证未通过
   */
  @state()
  private invalid = false;

  // 是否是初始状态，初始状态不显示动画
  private isInitial = true;

  private readonly inputRef: Ref<HTMLInputElement> = createRef();
  private readonly formController = new FormController(this);
  private readonly definedController = new DefinedController(this, {
    relatedElements: ['mdui-radio'],
  });

  /**
   * 表单验证状态对象 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  public get validity(): ValidityState {
    return this.inputRef.value!.validity;
  }

  /**
   * 表单验证未通过时的提示文案。验证通过时为空字符串
   */
  public get validationMessage(): string {
    return this.inputRef.value!.validationMessage;
  }

  // 为了使 <mdui-radio> 可以不是该组件的直接子元素，这里不用 @queryAssignedElements()
  private get items() {
    return $(this).find('mdui-radio').get() as unknown as Radio[];
  }

  private get itemsEnabled() {
    return $(this)
      .find('mdui-radio:not([disabled])')
      .get() as unknown as Radio[];
  }

  @watch('value', true)
  private async onValueChange() {
    this.isInitial = false;
    await this.definedController.whenDefined();

    this.emit('input');
    this.emit('change');
    this.updateItems();
    this.updateRadioFocusable();

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

  @watch('invalid', true)
  @watch('disabled')
  private async onInvalidChange() {
    await this.definedController.whenDefined();

    this.updateItems();
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
    const valid = this.inputRef.value!.checkValidity();

    if (!valid) {
      this.emit('invalid', {
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
      const eventProceeded = this.emit('invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });

      if (!eventProceeded) {
        // 调用了 preventDefault() 时，隐藏默认的表单错误提示
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
    return html`<fieldset>
      <input
        ${ref(this.inputRef)}
        type="radio"
        class="input"
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        .checked=${!!this.value}
        .required=${this.required}
        tabindex="-1"
        @keydown=${this.onKeyDown}
      />
      <slot
        @click=${this.onClick}
        @keydown=${this.onKeyDown}
        @slotchange=${this.onSlotChange}
        @change=${this.onCheckedChange}
      ></slot>
    </fieldset>`;
  }

  // 更新 mdui-radio 的 checked 后，需要更新可聚焦状态
  // 同一个 mdui-radio-group 中的多个 mdui-radio，仅有一个可聚焦
  // 若有已选中的，则已选中的可聚焦；若没有已选中的，则第一个可聚焦
  private updateRadioFocusable() {
    const items = this.items;
    const itemChecked = items.find((item) => item.checked);

    if (itemChecked) {
      items.forEach((item) => {
        item.focusable = item === itemChecked;
      });
    } else {
      this.itemsEnabled.forEach((item, index) => {
        item.focusable = !index;
      });
    }
  }

  private async onClick(event: MouseEvent) {
    await this.definedController.whenDefined();

    const target = event.target as HTMLElement;
    const item = target.closest('mdui-radio') as Radio | null;

    if (!item || item.disabled) {
      return;
    }

    this.value = item.value;

    await this.updateComplete;
    item.focus();
  }

  /**
   * 在内部的 `<mdui-radio>` 上按下按键时，在 `<mdui-radio>` 之间切换焦点
   */
  private async onKeyDown(event: KeyboardEvent) {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(
        event.key,
      )
    ) {
      return;
    }

    event.preventDefault();

    await this.definedController.whenDefined();

    const items = this.itemsEnabled;
    const itemChecked = items.find((item) => item.checked) ?? items[0];
    const incr =
      event.key === ' '
        ? 0
        : ['ArrowUp', 'ArrowLeft'].includes(event.key)
        ? -1
        : 1;
    let index = items.indexOf(itemChecked) + incr;
    if (index < 0) {
      index = items.length - 1;
    }
    if (index > items.length - 1) {
      index = 0;
    }

    this.value = items[index].value;

    await this.updateComplete;
    items[index].focus();
  }

  private async onSlotChange() {
    await this.definedController.whenDefined();

    this.updateItems();
    this.updateRadioFocusable();
  }

  /**
   * slot 中的 mdui-radio 的 checked 变更时触发的事件
   */
  private onCheckedChange(event: Event) {
    event.stopPropagation();
  }

  // 更新 <mdui-radio> 的状态
  private updateItems() {
    this.items.forEach((item) => {
      item.checked = item.value === this.value;
      item.invalid = this.invalid;
      item.groupDisabled = this.disabled;
      item.isInitial = this.isInitial;
    });
  }
}

export interface RadioGroupEventMap {
  change: CustomEvent<void>;
  input: CustomEvent<void>;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-radio-group': RadioGroup;
  }
}

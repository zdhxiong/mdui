import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/closest.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
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
export class RadioGroup extends LitElement implements FormControl {
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
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private invalid = false;

  private readonly inputRef: Ref<HTMLInputElement> = createRef();
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

  private get radios() {
    return $(this).find('mdui-radio').get() as unknown as Radio[];
  }

  private get radiosEnabled() {
    return $(this)
      .find('mdui-radio:not([disabled])')
      .get() as unknown as Radio[];
  }

  @watch('value', true)
  private async onValueChange() {
    emit(this, 'input');
    emit(this, 'change');
    this.radios.forEach(
      (radio) => (radio.checked = radio.value === this.value),
    );
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

  @watch('invalid')
  private onInvalidChange() {
    this.radiosEnabled.forEach((radio) => (radio.invalid = this.invalid));
  }

  @watch('disabled')
  private onDisabledChange() {
    this.radios.forEach((radio) => (radio.groupDisabled = this.disabled));
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
        @click=${this.onRadioClick}
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
    const radios = this.radios;
    const radioChecked = radios.find((radio) => radio.checked);

    if (radioChecked) {
      radios.forEach((radio) => (radio.focusable = radio === radioChecked));
    } else {
      this.radiosEnabled.forEach((radio, index) => (radio.focusable = !index));
    }
  }

  private async onRadioClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const radio = isNodeName(target, 'mdui-radio')
      ? (target as Radio)
      : ($(target).closest('mdui-radio')[0] as Radio);

    if (radio.disabled) {
      return;
    }

    this.value = radio.value;

    await this.updateComplete;
    radio.focus();
  }

  /**
   * 在内部的 `<mdui-radio>` 上按下按键时，在 `<mdui-radio>` 之间切换焦点
   */
  private onKeyDown(event: KeyboardEvent) {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(
        event.key,
      )
    ) {
      return;
    }

    const radios = this.radiosEnabled;
    const radioChecked = radios.find((radio) => radio.checked) ?? radios[0];
    const incr =
      event.key === ' '
        ? 0
        : ['ArrowUp', 'ArrowLeft'].includes(event.key)
        ? -1
        : 1;
    let index = radios.indexOf(radioChecked) + incr;
    if (index < 0) {
      index = radios.length - 1;
    }
    if (index > radios.length - 1) {
      index = 0;
    }

    this.value = radios[index].value;

    this.updateComplete.then(() => {
      radios[index].focus();
    });

    event.preventDefault();
  }

  private onSlotChange() {
    this.radios.forEach(
      (radio) => (radio.checked = radio.value === this.value),
    );
    this.updateRadioFocusable();
  }

  /**
   * slot 中的 mdui-radio 的 checked 变更时触发的事件
   */
  private onCheckedChange(event: Event) {
    event.stopPropagation();
    const target = event.target as Radio;
    this.value = target.value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-radio-group': RadioGroup;
  }
}

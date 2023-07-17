import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/check.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event input - 选中状态变更时触发
 * @event invalid - 表单字段验证不通过时触发
 *
 * @slot unchecked-icon - 未选中状态的元素
 * @slot checked-icon - 选中状态的元素
 *
 * @csspart track - 轨道
 * @csspart thumb - 图标容器
 * @csspart unchecked-icon - 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 */
@customElement('mdui-switch')
export class Switch
  extends RippleMixin(FocusableMixin(LitElement))
  implements FormControl
{
  public static override styles: CSSResultGroup = [componentStyle, style];

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
   * 是否为选中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public checked = false;

  /**
   * 默认选中状态。在重置表单时，将重置为该默认状态。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue('checked')
  public defaultChecked = false;

  /**
   * 未选中状态的图标
   */
  @property({ reflect: true, attribute: 'unchecked-icon' })
  public uncheckedIcon?: string;

  /**
   * 选中状态的图标
   *
   * 默认为 check，可传入空字符串移除默认图标
   */
  @property({ reflect: true, attribute: 'checked-icon' })
  public checkedIcon?: string;

  /**
   * 提交表单时，是否必须选中该开关
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
   * 开关的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 开关的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = 'on';

  /**
   * 是否验证未通过
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private invalid = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly inputRef: Ref<HTMLInputElement> = createRef();
  private readonly formController: FormController = new FormController(this, {
    value: (control) => (control.checked ? control.value : undefined),
    defaultValue: (control) => control.defaultChecked!,
    setValue: (control, checked) => (control.checked = checked as boolean),
  });
  private readonly hasSlotController = new HasSlotController(
    this,
    'unchecked-icon',
  );

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

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  protected override get focusElement(): HTMLElement {
    return this.inputRef.value!;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled;
  }

  @watch('disabled', true)
  @watch('required', true)
  private async onDisabledChange() {
    await this.updateComplete;
    this.invalid = !this.inputRef.value!.checkValidity();
  }

  @watch('checked', true)
  private async onCheckedChange() {
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
        this.blur();
        this.focus();
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
    return html`<label>
      <input
        ${ref(this.inputRef)}
        type="checkbox"
        name=${ifDefined(this.name)}
        value=${ifDefined(this.value)}
        .disabled=${this.disabled}
        .checked=${live(this.checked)}
        .required=${this.required}
        @change=${this.onChange}
      />
      <div part="track" class="track">
        <div
          part="thumb"
          class="thumb ${classMap({
            'has-unchecked-icon':
              this.uncheckedIcon ||
              this.hasSlotController.test('unchecked-icon'),
          })}"
        >
          <mdui-ripple
            ${ref(this.rippleRef)}
            .noRipple=${this.noRipple}
          ></mdui-ripple>
          <slot name="checked-icon">
            ${this.checkedIcon
              ? html`<mdui-icon
                  part="checked-icon"
                  class="checked-icon"
                  name=${this.checkedIcon}
                ></mdui-icon>`
              : this.checkedIcon === ''
              ? nothingTemplate
              : html`<mdui-icon-check
                  part="checked-icon"
                  class="checked-icon"
                ></mdui-icon-check>`}
          </slot>
          <slot name="unchecked-icon">
            ${this.uncheckedIcon
              ? html`<mdui-icon
                  part="unchecked-icon"
                  class="unchecked-icon"
                  name=${this.uncheckedIcon}
                ></mdui-icon>`
              : nothingTemplate}
          </slot>
        </div>
      </div>
    </label>`;
  }

  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  private onChange() {
    this.checked = this.inputRef.value!.checked;
    emit(this, 'change');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

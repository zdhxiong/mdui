import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
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
 * @summary 开关切换组件
 *
 * ```html
 * <mdui-switch></mdui-switch>
 * ```
 *
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
 *
 * @cssprop --shape-corner - 组件轨道的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-thumb - 组件图标容器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-switch')
export class Switch
  extends RippleMixin(FocusableMixin(MduiElement))<SwitchEventMap>
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
   * 默认选中状态。在重置表单时，将重置为此状态。此属性只能通过 JavaScript 属性设置
   */
  @defaultValue('checked')
  public defaultChecked = false;

  /**
   * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
   */
  @property({ reflect: true, attribute: 'unchecked-icon' })
  public uncheckedIcon?: string;

  /**
   * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
   *
   * 默认为 `check` 图标，可传入空字符串移除默认图标
   */
  @property({ reflect: true, attribute: 'checked-icon' })
  public checkedIcon?: string;

  /**
   * 提交表单时，是否必须选中此开关
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public required = false;

  /**
   * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
   *
   * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
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
  @state()
  private invalid = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly inputRef: Ref<HTMLInputElement> = createRef();
  private readonly formController = new FormController(this, {
    value: (control) => (control.checked ? control.value : undefined),
    defaultValue: (control) => control.defaultChecked!,
    setValue: (control, checked) => (control.checked = checked as boolean),
  });
  private readonly hasSlotController = new HasSlotController(
    this,
    'unchecked-icon',
  );

  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  public get validity(): ValidityState {
    return this.inputRef.value!.validity;
  }

  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
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
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
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
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.inputRef.value!.reportValidity();

    if (this.invalid) {
      const eventProceeded = this.emit('invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });

      // 调用了 preventDefault() 时，隐藏默认的表单错误提示
      if (!eventProceeded) {
        this.blur();
        this.focus();
      }
    }

    return !this.invalid;
  }

  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  public setCustomValidity(message: string): void {
    this.inputRef.value!.setCustomValidity(message);
    this.invalid = !this.inputRef.value!.checkValidity();
  }

  protected override render(): TemplateResult {
    return html`<label
      class=${classMap({
        invalid: this.invalid,
        'has-unchecked-icon':
          this.uncheckedIcon || this.hasSlotController.test('unchecked-icon'),
      })}
    >
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
        <div part="thumb" class="thumb">
          <mdui-ripple
            ${ref(this.rippleRef)}
            .noRipple=${this.noRipple}
          ></mdui-ripple>
          <slot name="checked-icon" part="checked-icon" class="checked-icon">
            ${this.checkedIcon
              ? html`<mdui-icon name=${this.checkedIcon} class="i"></mdui-icon>`
              : this.checkedIcon === ''
                ? nothingTemplate
                : html`<mdui-icon-check class="i"></mdui-icon-check>`}
          </slot>
          <slot
            name="unchecked-icon"
            part="unchecked-icon"
            class="unchecked-icon"
          >
            ${this.uncheckedIcon
              ? html`<mdui-icon
                  name=${this.uncheckedIcon}
                  class="i"
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
    this.emit('change');
  }
}

export interface SwitchEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
  input: Event;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

import { html, LitElement, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '@mdui/icons/check.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event input - 选中状态变更时触发
 * @event invalid - 表单字段验证不通过时触发
 *
 * @slot icon - 未选中状态的图标
 * @slot checked-icon 选中状态的图标
 *
 * @csspart track - 轨道
 * @csspart thumb - 图标容器
 * @csspart icon - 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 */
@customElement('mdui-switch')
export class Switch extends RippleMixin(FocusableMixin(LitElement)) {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否为禁用状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public disabled = false;

  /**
   * 是否为选中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public checked = false;

  /**
   * 未选中状态的图标
   */
  @property({ reflect: true })
  public icon!: string;

  /**
   * 选中状态的图标
   *
   * 默认为 check，可传入空字符串移除默认图标
   */
  @property({ reflect: true, attribute: 'checked-icon' })
  public checkedIcon!: string;

  /**
   * 提交表单时，是否必须选中该开关
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public required = false;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form!: string;

  /**
   * 开关的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  /**
   * 开关的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = 'on';

  @query('input')
  private readonly inputElement!: HTMLInputElement;

  /**
   * 是否验证未通过
   */
  @state()
  private invalid = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly formController: FormController = new FormController(this, {
    value: (control: Switch) => (control.checked ? control.value : undefined),
  });
  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'checked-icon',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  protected override get focusElement(): HTMLElement {
    return this.inputElement;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled;
  }

  @watch('disabled', true)
  @watch('checked', true)
  @watch('required', true)
  private async onDisabledChange() {
    await this.updateComplete;
    this.invalid = !this.inputElement.checkValidity();
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
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string): void {
    this.inputElement.setCustomValidity(message);
    this.invalid = !this.inputElement.checkValidity();
  }

  protected override render(): TemplateResult {
    return html`<label>
      <input
        class=${classMap({ invalid: this.invalid })}
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
            'has-icon': this.icon || this.hasSlotController.test('icon'),
          })}"
        >
          <mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>
          <slot name="checked-icon">
            ${this.checkedIcon
              ? html`<mdui-icon
                  part="checked-icon"
                  class="checked-icon"
                  name=${this.checkedIcon}
                ></mdui-icon>`
              : this.checkedIcon === ''
              ? nothing
              : html`<mdui-icon-check
                  part="checked-icon"
                  class="checked-icon"
                ></mdui-icon-check>`}
          </slot>
          <slot name="icon">
            ${when(
              this.icon,
              () => html`<mdui-icon
                part="icon"
                class="icon"
                name=${this.icon}
              ></mdui-icon>`,
            )}
          </slot>
        </div>
      </div>
    </label>`;
  }

  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  private onChange() {
    this.checked = this.inputElement.checked;
    emit(this, 'change');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

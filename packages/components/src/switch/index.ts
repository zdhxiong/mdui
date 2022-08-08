import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Options } from '@lit-labs/motion';
import { html, LitElement } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { animate, AnimateController } from '@lit-labs/motion';
import { watch } from '@mdui/shared/decorators/watch.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import {
  EASING_DECELERATION,
  EASING_STANDARD,
  KEYFRAME_FADE_THROUGTH_IN,
  KEYFRAME_FADE_THROUGTH_OUT,
} from '@mdui/shared/helpers/motion.js';
import type { Ripple } from '../ripple/index.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
import '../icon.js';
import '@mdui/icons/check.js';

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
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @query('input')
  protected inputElement!: HTMLInputElement;

  protected get focusDisabled(): boolean {
    return this.disabled;
  }

  protected get focusElement(): HTMLElement {
    return this.inputElement;
  }

  protected get rippleDisabled(): boolean {
    return this.disabled;
  }

  protected readonly formController: FormController = new FormController(this, {
    value: (control: Switch) => (control.checked ? control.value : undefined),
  });

  protected readonly animateController = new AnimateController(this, {
    defaultOptions: {
      keyframeOptions: {
        delay: 30,
        duration: 70,
        easing: EASING_DECELERATION,
        fill: 'both',
      },
      in: KEYFRAME_FADE_THROUGTH_IN.slice(0, -1),
      out: KEYFRAME_FADE_THROUGTH_OUT,
    },
  });

  protected readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'checked-icon',
  );

  /**
   * 是否验证未通过
   */
  @state()
  private invalid = false;

  /**
   * 是否为禁用状态
   */
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 是否为选中状态
   */
  @property({ type: Boolean, reflect: true })
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
   * 开关的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  /**
   * 开关的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = 'on';

  @watch('disabled', true)
  @watch('checked', true)
  @watch('required', true)
  private async onDisabledChange() {
    await this.updateComplete;
    this.invalid = !this.inputElement.checkValidity();
  }

  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  private onChange() {
    this.checked = this.inputElement.checked;
    emit(this, 'change');
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
    const {
      disabled,
      checked,
      name,
      value,
      required,
      invalid,
      icon,
      checkedIcon,
    } = this;
    const animateOutOptions: Options = {
      keyframeOptions: {
        duration: 30,
        easing: EASING_STANDARD,
      },
    };

    return html`<label>
      <input
        class=${classMap({ invalid })}
        type="checkbox"
        name=${ifDefined(name)}
        value=${ifDefined(value)}
        .disabled=${disabled}
        .checked=${live(checked)}
        .required=${required}
        @change=${this.onChange}
      />
      <div part="track" class="track">
        <div
          part="thumb"
          class="thumb ${classMap({
            'has-icon': icon || this.hasSlotController.test('icon'),
          })}"
        >
          <mdui-ripple></mdui-ripple>
          ${checked
            ? html`${checkedIcon
                ? html`<mdui-icon
                    part="checked-icon"
                    class="checked-icon"
                    name=${checkedIcon}
                    ${animate(animateOutOptions)}
                  ></mdui-icon>`
                : this.hasSlotController.test('checked-icon')
                ? html`<slot
                    part="checked-icon"
                    name="checked-icon"
                    ${animate(animateOutOptions)}
                  ></slot>`
                : checkedIcon === ''
                ? ''
                : html`<mdui-icon-check
                    part="checked-icon"
                    class="checked-icon"
                    ${animate(animateOutOptions)}
                  ></mdui-icon-check>`}`
            : html`${icon
                ? html`<mdui-icon
                    part="icon"
                    class="icon"
                    name=${icon}
                    ${animate(animateOutOptions)}
                  ></mdui-icon>`
                : html`<slot
                    part="icon"
                    name="icon"
                    ${animate(animateOutOptions)}
                  ></slot>`}`}
        </div>
      </div>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

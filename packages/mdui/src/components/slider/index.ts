import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { SliderBase } from './slider-base.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 滑块组件
 *
 * ```html
 * <mdui-slider></mdui-slider>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在值发生变更，且失去焦点时，将触发该事件
 * @event input - 值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @csspart track-inactive - 未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label 提示文本
 * @csspart tickmark - 刻度标记
 */
@customElement('mdui-slider')
export class Slider extends SliderBase<SliderEventMap> implements FormControl {
  public static override styles: CSSResultGroup = [SliderBase.styles, style];

  /**
   * 滑块的值，将于表单数据一起提交
   */
  @property({ type: Number })
  public value = 0;

  /**
   * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue()
  public defaultValue = 0;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly handleRef: Ref<HTMLElement> = createRef();
  private readonly formController = new FormController(this);

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  @watch('value', true)
  private async onValueChange() {
    this.value = this.fixValue(this.value);

    // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
    const form = this.formController.getForm();
    if (form && formResets.get(form)?.has(this)) {
      this.invalid = false;
      formResets.get(form)!.delete(this);
    } else {
      await this.updateComplete;
      this.invalid = !this.inputRef.value!.checkValidity();
    }

    this.updateStyle();
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.value = this.fixValue(this.value);
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    const onTouchStart = () => {
      if (!this.disabled) {
        this.labelVisible = true;
      }
    };

    const onTouchEnd = () => {
      if (!this.disabled) {
        this.labelVisible = false;
      }
    };

    this.addEventListener('touchstart', onTouchStart);
    this.addEventListener('mousedown', onTouchStart);
    this.addEventListener('touchend', onTouchEnd);
    this.addEventListener('mouseup', onTouchEnd);

    this.updateStyle();
  }

  /**
   * <input /> 用于提供拖拽操作
   * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
   */
  protected override render(): TemplateResult {
    return html`<label class=${classMap({ invalid: this.invalid })}>
      <input
        ${ref(this.inputRef)}
        type="range"
        step=${this.step}
        min=${this.min}
        max=${this.max}
        ?disabled=${this.disabled}
        .value=${live(this.value.toString())}
        @input=${this.onInput}
        @change=${this.onChange}
      />
      <div part="track-inactive" class="track-inactive"></div>
      <div
        ${ref(this.trackActiveRef)}
        part="track-active"
        class="track-active"
      ></div>
      <div ${ref(this.handleRef)} part="handle" class="handle">
        <div class="elevation"></div>
        <mdui-ripple
          ${ref(this.rippleRef)}
          .noRipple=${this.noRipple}
        ></mdui-ripple>
        ${this.renderLabel(this.value)}
      </div>
      ${when(this.tickmarks, () =>
        map(
          this.getCandidateValues(),
          (value) =>
            html`<div
              part="tickmark"
              class="tickmark ${classMap({ active: value < this.value })}"
              style="${styleMap({
                left: `${((value - this.min) / this.max) * 100}%`,
                display: value === this.value ? 'none' : 'block',
              })}"
            ></div>`,
        ),
      )}
    </label>`;
  }

  private updateStyle() {
    const percent = ((this.value - this.min) / (this.max - this.min)) * 100;

    this.trackActiveRef.value!.style.width = `${percent}%`;
    this.handleRef.value!.style.left = `${percent}%`;
  }

  private onInput() {
    this.value = parseFloat(this.inputRef.value!.value);

    this.updateStyle();
  }
}

export interface SliderEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
  input: Event;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-slider': Slider;
  }
}

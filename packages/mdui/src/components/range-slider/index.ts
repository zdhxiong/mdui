import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { SliderBase } from '../slider/slider-base.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 范围滑块组件
 *
 * ```html
 * <mdui-range-slider></mdui-range-slider>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在值发生了变更，且失去了焦点时，将触发该事件
 * @event input - 值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @csspart track-inactive - 未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label - 提示文本
 * @csspart tickmark - 刻度标记
 */
@customElement('mdui-range-slider')
export class RangeSlider
  extends SliderBase<RangeSliderEventMap>
  implements FormControl
{
  public static override styles: CSSResultGroup = [SliderBase.styles];

  /**
   * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue()
  public defaultValue: number[] = [];

  /**
   * 当前操作的是哪一个 handle
   */
  @state()
  private currentHandle: 'start' | 'end' = 'start';

  // 当前鼠标悬浮在哪个 handle 上
  private hoverHandle?: 'start' | 'end';

  private readonly rippleStartRef: Ref<Ripple> = createRef();
  private readonly rippleEndRef: Ref<Ripple> = createRef();
  private readonly handleStartRef: Ref<HTMLElement> = createRef();
  private readonly handleEndRef: Ref<HTMLElement> = createRef();
  private readonly formController = new FormController(this);
  private _value: number[] = [];

  /**
   * 滑块的值，为数组格式；将于表单数据一起提交
   *
   * NOTE:
   * 该属性无法通过 HTML 属性设置初始值，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property({ type: Array, attribute: false })
  public get value(): number[] {
    return this._value;
  }
  public set value(_value: number[]) {
    const oldValue = [...this._value];
    this._value = [this.fixValue(_value[0]), this.fixValue(_value[1])];
    this.requestUpdate('value', oldValue);

    this.updateComplete.then(() => {
      this.updateStyle();

      // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
      const form = this.formController.getForm();
      if (form && formResets.get(form)?.has(this)) {
        this.invalid = false;
        formResets.get(form)!.delete(this);
      } else {
        this.invalid = !this.inputRef.value!.checkValidity();
      }
    });
  }

  protected override get rippleElement() {
    return [this.rippleStartRef.value!, this.rippleEndRef.value!];
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    if (!this.value.length) {
      this.value = [this.min, this.max];
    }

    this.value[0] = this.fixValue(this.value[0]);
    this.value[1] = this.fixValue(this.value[1]);

    if (!this.defaultValue.length) {
      this.defaultValue = [...this.value];
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    // 在轨道上点击时，计算出点击位置在 <input type="range"> 元素上的值
    // 若该值在 this.value 的两个值中间位置的左侧，则表示操作的是左侧的值，否则操作的是右侧的值
    const getCurrentHandle = (event: PointerEvent) => {
      const $this = $(this);

      // 计算出鼠标悬浮位置的值，<mdui-range-slider> 元素的左右两侧有内边距，计算时要去除内边距
      const paddingLeft = parseFloat($this.css('padding-left'));
      const paddingRight = parseFloat($this.css('padding-right'));
      const percent =
        (event.offsetX - paddingLeft) /
        (this.clientWidth - paddingLeft - paddingRight);
      const pointerValue = (this.max - this.min) * percent + this.min;

      // 计算 this.value 两个值中间位置的值
      const middleValue = (this.value[1] - this.value[0]) / 2 + this.value[0];

      return pointerValue > middleValue ? 'end' : 'start';
    };

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

    // 按下鼠标时，计算当前操作的是起始值还是结束值
    this.addEventListener('pointerdown', (event: PointerEvent) => {
      this.currentHandle = getCurrentHandle(event);
    });

    // 移动鼠标时，修改 mdui-ripple 的 hover 状态
    this.addEventListener('pointermove', (event: PointerEvent) => {
      const currentHandle = getCurrentHandle(event);
      if (this.hoverHandle !== currentHandle) {
        this.endHover(event);
        this.hoverHandle = currentHandle;
        this.startHover(event);
      }
    });

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
        @input=${this.onInput}
        @change=${this.onChange}
      />
      <div part="track-inactive" class="track-inactive"></div>
      <div
        ${ref(this.trackActiveRef)}
        part="track-active"
        class="track-active"
      ></div>
      <div
        ${ref(this.handleStartRef)}
        part="handle"
        class="handle start"
        style=${styleMap({
          'z-index': this.currentHandle === 'start' ? '2' : '1',
        })}
      >
        <div class="elevation"></div>
        <mdui-ripple
          ${ref(this.rippleStartRef)}
          .noRipple=${this.noRipple}
        ></mdui-ripple>
        ${this.renderLabel(this.value[0])}
      </div>
      <div
        ${ref(this.handleEndRef)}
        part="handle"
        class="handle end"
        style=${styleMap({
          'z-index': this.currentHandle === 'end' ? '2' : '1',
        })}
      >
        <div class="elevation"></div>
        <mdui-ripple
          ${ref(this.rippleEndRef)}
          .noRipple=${this.noRipple}
        ></mdui-ripple>
        ${this.renderLabel(this.value[1])}
      </div>
      ${when(this.tickmarks, () =>
        map(
          this.getCandidateValues(),
          (value) =>
            html`<div
              part="tickmark"
              class="tickmark ${classMap({
                active: value > this.value[0] && value < this.value[1],
              })}"
              style="${styleMap({
                left: `${((value - this.min) / this.max) * 100}%`,
                display:
                  value === this.value[0] || value === this.value[1]
                    ? 'none'
                    : 'block',
              })}"
            ></div>`,
        ),
      )}
    </label>`;
  }

  protected override getRippleIndex = () => {
    if (this.hoverHandle) {
      return this.hoverHandle === 'start' ? 0 : 1;
    }
    return this.currentHandle === 'start' ? 0 : 1;
  };

  private updateStyle() {
    const getPercent = (value: number) =>
      ((value - this.min) / (this.max - this.min)) * 100;

    const startPercent = getPercent(this.value[0]);
    const endPercent = getPercent(this.value[1]);

    this.trackActiveRef.value!.style.width = `${endPercent - startPercent}%`;
    this.trackActiveRef.value!.style.left = `${startPercent}%`;
    this.handleStartRef.value!.style.left = `${startPercent}%`;
    this.handleEndRef.value!.style.left = `${endPercent}%`;
  }

  private onInput() {
    const isStart = this.currentHandle === 'start';
    const value = parseFloat(this.inputRef.value!.value);
    const startValue = this.value[0];
    const endValue = this.value[1];

    const doInput = () => {
      this.updateStyle();
    };

    if (isStart) {
      if (value <= endValue) {
        this.value = [value, endValue];
        doInput();
      } else if (startValue !== endValue) {
        this.value = [endValue, endValue];
        doInput();
      }
    } else {
      if (value >= startValue) {
        this.value = [startValue, value];
        doInput();
      } else if (startValue !== endValue) {
        this.value = [startValue, startValue];
        doInput();
      }
    }
  }
}

export interface RangeSliderEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
  input: Event;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-range-slider': RangeSlider;
  }
}

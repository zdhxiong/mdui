import { html, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { map } from 'lit/directives/map.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/on.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { SliderBase } from '../slider/slider-base.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在值发生了变更，且失去了焦点时，将触发该事件
 * @event input - 值变更时触发
 *
 * @csspart track-inactive - 底部未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label 提示文本
 * @csspart tickmark - 刻度标记
 */
@customElement('mdui-range-slider')
export class RangeSlider extends SliderBase {
  public static override styles: CSSResultGroup = [SliderBase.styles, style];

  @query('.handle.start', true)
  private readonly handleStart!: HTMLElement;

  @query('.handle.end', true)
  private readonly handleEnd!: HTMLElement;

  /**
   * 当前操作的是哪一个 handle
   */
  @state()
  private currentHandle: 'start' | 'end' = 'start';

  // 当前鼠标悬浮在哪个 handle 上
  private hoverHandle?: 'start' | 'end';

  private readonly rippleRef: Ref<Ripple> = createRef();
  private _value: number[] = [];

  /**
   * 滑块的值，为数组格式；将于表单数据一起提交
   *
   * NOTE:
   * 该属性无法通过 HTML 属性设置初始值，如果要修改该值，只能通过修改 JavaScript 属性值实现。
   */
  @property({ type: Array })
  public get value(): number[] {
    return this._value;
  }
  public set value(_value: number[]) {
    this._value = _value;
    setTimeout(() => {
      this.updateStyle();
    });
  }

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.value = [this.min, this.max];

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

    $(this).on({
      'touchstart._slider mousedown._slider': () => {
        if (!this.disabled) {
          this.labelVisible = true;
        }
      },
      'touchend._slider mouseup._slider': () => {
        if (!this.disabled) {
          this.labelVisible = false;
        }
      },
      // 按下鼠标时，计算当前操作的是起始值还是结束值
      'pointerdown._slider': (event: PointerEvent) => {
        this.currentHandle = getCurrentHandle(event);
      },
      // 移动鼠标时，修改 mdui-ripple 的 hover 状态
      'pointermove._slider': (event: PointerEvent) => {
        const currentHandle = getCurrentHandle(event);
        if (this.hoverHandle !== currentHandle) {
          this.endHover(event);
          this.hoverHandle = currentHandle;
          this.startHover(event);
        }
      },
    });
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.updateStyle();
  }

  protected override render(): TemplateResult {
    return html`<label>
      <input
        type="range"
        step=${this.step}
        min=${this.min}
        max=${this.max}
        ?disabled=${this.disabled}
        @input=${this.onInput}
        @change=${this.onChange}
      />
      <div part="track-inactive" class="track-inactive"></div>
      <div part="track-active" class="track-active"></div>
      <div
        part="handle"
        class="handle start"
        style=${styleMap({
          'z-index': this.currentHandle === 'start' ? '2' : '1',
        })}
      >
        <mdui-ripple></mdui-ripple>
        ${this.renderLabel(this.value[0])}
      </div>
      <div
        part="handle"
        class="handle end"
        style=${styleMap({
          'z-index': this.currentHandle === 'end' ? '2' : '1',
        })}
      >
        <mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>
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

    this.trackActive.style.width = `${endPercent - startPercent}%`;
    this.trackActive.style.left = `${startPercent}%`;
    this.handleStart.style.left = `${startPercent}%`;
    this.handleEnd.style.left = `${endPercent}%`;
  }

  private onInput() {
    const isStart = this.currentHandle === 'start';
    const value = parseFloat(this.input.value);
    const startValue = this.value[0];
    const endValue = this.value[1];

    const doInput = () => {
      emit(this, 'input');
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

declare global {
  interface HTMLElementTagNameMap {
    'mdui-range-slider': RangeSlider;
  }
}

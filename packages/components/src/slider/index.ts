import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { live } from 'lit/directives/live.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import type { Ripple } from '../ripple/index.js';
import { SliderBase } from './slider-base.js';
import { style } from './style.js';

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
@customElement('mdui-slider')
export class Slider extends SliderBase {
  static override styles: CSSResultGroup = [SliderBase.styles, style];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @query('.handle', true)
  private handle!: HTMLElement;

  /**
   * 滑块的值，将于表单数据一起提交
   */
  @property({ type: Number, reflect: true })
  public value = 0;

  connectedCallback() {
    super.connectedCallback();

    if (this.value < this.min) {
      this.value = this.min;
    }
    if (this.value > this.max) {
      this.value = this.max;
    }

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
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.updateStyle();
  }

  private updateStyle() {
    const percent = ((this.value - this.min) / (this.max - this.min)) * 100;

    this.trackActive.style.width = `${percent}%`;
    this.handle.style.left = `${percent}%`;
  }

  private onInput() {
    this.value = parseFloat(this.input.value);
    emit(this, 'input');

    this.updateStyle();
  }

  @watch('value', true)
  private onValueChange() {
    this.invalid = !this.checkValidity();

    this.input.value = this.value.toString();
    this.value = parseFloat(this.input.value);

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
        .value=${live(this.value.toString())}
        @input=${this.onInput}
        @change=${this.onChange}
      />
      <div part="track-inactive" class="track-inactive"></div>
      <div part="track-active" class="track-active"></div>
      <div part="handle" class="handle">
        <mdui-ripple></mdui-ripple>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-slider': Slider;
  }
}

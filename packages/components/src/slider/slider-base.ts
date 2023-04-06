import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { sliderBaseStyle } from './slider-base-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

export class SliderBase extends RippleMixin(FocusableMixin(LitElement)) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    sliderBaseStyle,
  ];

  /**
   * 最小允许值
   */
  @property({ type: Number, reflect: true })
  public min = 0;

  /**
   * 最大允许值
   */
  @property({ type: Number, reflect: true })
  public max = 100;

  /**
   * 步进间隔
   */
  @property({ type: Number, reflect: true })
  public step = 1;

  /**
   * 是否添加刻度标记
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public tickmarks = false;

  /**
   * 是否不显示文本提示
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public nolabel = false;

  /**
   * 是否禁用
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
   * 滑块名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 是否验证未通过
   *
   * 该验证为根据是否通过 `setCustomValidity` 方法设置了值，来判断是否验证通过
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public invalid = false;

  // 按下时，label 可见
  @state()
  protected labelVisible = false;

  protected readonly inputRef: Ref<HTMLInputElement> = createRef();
  protected readonly trackActiveRef: Ref<HTMLElement> = createRef();

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
  private onDisabledChange() {
    this.invalid = !this.inputRef.value!.checkValidity();
  }

  /**
   * 用于自定义标签的显示格式
   */
  public labelFormatter: (value: number) => string = (value: number) =>
    value.toString();

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

  /**
   * 获取候选值组成的数组
   */
  protected getCandidateValues() {
    return Array.from(
      { length: this.max - this.min + 1 },
      (_, index) => index + this.min,
    ).filter((value) => !((value - this.min) % this.step));
  }

  /**
   * 渲染浮动标签
   */
  protected renderLabel(value: number): TemplateResult {
    return when(
      !this.nolabel,
      () =>
        html`<div
          part="label"
          class="label ${classMap({ 'label-visible': this.labelVisible })}"
        >
          ${this.labelFormatter(value)}
        </div>`,
    );
  }

  protected onChange() {
    emit(this, 'change');
  }
}

import { html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { sliderBaseStyle } from './slider-base-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

export class SliderBase extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [componentStyle, sliderBaseStyle];

  @query('input')
  protected readonly input!: HTMLInputElement;

  @query('.track-active', true)
  protected readonly trackActive!: HTMLElement;

  // 按下时，label 可见
  @state()
  protected labelVisible = false;

  protected override get focusElement(): HTMLElement {
    return this.input;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  private readonly formController: FormController = new FormController(this);

  /**
   * 最小允许值
   */
  @property({ type: Number })
  public min = 0;

  /**
   * 最大允许值
   */
  @property({ type: Number })
  public max = 100;

  /**
   * 步进间隔
   */
  @property({ type: Number })
  public step = 1;

  /**
   * 是否添加刻度标记
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public tickmarks = false;

  /**
   * 是否不显示文本提示
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public nolabel = false;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public disabled = false;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form!: string;

  /**
   * 滑块名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  /**
   * 是否验证未通过
   *
   * 该验证为根据是否通过 `setCustomValidity` 方法设置了值，来判断是否验证通过
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public invalid = false;

  /**
   * 用于自定义标签的显示格式
   */
  public labelFormatter: (value: number) => string = (value: number) =>
    value.toString();

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

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
    return this.input.checkValidity();
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.input.reportValidity();
    return !this.invalid;
  }

  /**
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string): void {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }

  protected onChange() {
    emit(this, 'change');
  }

  @watch('disabled', true)
  private onDisabledChange() {
    // 禁用状态始终为验证通过，所以在 disabled 变更时需要重新验证
    this.input.disabled = this.disabled;
    this.invalid = !this.checkValidity();
  }
}

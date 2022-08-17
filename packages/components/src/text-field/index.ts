import type { TemplateResult, CSSResultGroup } from 'lit';
import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { classMap } from 'lit/directives/class-map.js';
import { animate } from '@lit-labs/motion';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import {
  DURATION_SMALL,
  EASING_STANDARD,
} from '@mdui/shared/helpers/motion.js';
import { style } from './style.js';
import '../icon.js';
import '../icon-button.js';
import '@mdui/icons/cancel--outlined.js';
import '@mdui/icons/error.js';
import '@mdui/icons/visibility.js';
import '@mdui/icons/visibility-off.js';

/**
 * @event click
 * @event focus
 * @event blur
 * @event change
 * @event input
 * @event invalid
 * @event clear - 在点击由 clearable 属性生成的清空按钮时触发。可以通过调用 `event.preventDefault()` 阻止清空文本框
 *
 * @slot prefix-icon
 * @slot prefix
 * @slot suffix
 * @slot suffix-icon
 * @slot clear-icon
 * @slot show-password-icon
 * @slot hide-password-icon
 * @slot helper
 * @slot error
 *
 * @csspart text-field
 * @csspart prefix-icon
 * @csspart prefix
 * @csspart input-container
 * @csspart label
 * @csspart input
 * @csspart suffix
 * @csspart suffix-icon
 * @csspart clear-button
 * @csspart toggle-password-button
 * @csspart supporting
 * @csspart helper
 * @csspart error
 * @csspart counter
 */
@customElement('mdui-text-field')
export class TextField extends FocusableMixin(LitElement) {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('.input')
  protected inputElement!: HTMLInputElement | HTMLTextAreaElement;

  protected get focusDisabled(): boolean {
    return this.disabled;
  }

  protected get focusElement(): HTMLElement {
    return this.inputElement;
  }

  protected readonly formController: FormController = new FormController(this);
  protected readonly hasSlotController = new HasSlotController(
    this,
    'prefix-icon',
    'suffix-icon',
  );
  protected resizeObserver!: ResizeObserver;

  @state() protected isPasswordVisible = false;
  @state() protected hasValue = false;

  /**
   * 是否渲染为 textarea。为 false 时渲染为 input
   */
  protected get isTextarea() {
    return (this.rows && this.rows > 1) || this.autosize;
  }

  /**
   * 文本框形状。可选值为：
   * * `filled`
   * * `outlined`
   */
  @property({ reflect: true })
  public variant: 'filled' /*预览图*/ | 'outlined' /*预览图*/ = 'filled';

  /**
   * 文本框输入类型。可选值为：
   * * `email`：
   * * `number`：
   * * `password`：
   * * `search`：
   * * `tel`：
   * * `text`：
   * * `url`：
   */
  @property({ reflect: true })
  public type:
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'time'
    | 'week' = 'text';

  /**
   * 文本框名称，将与表单数据一起提交
   */
  @property()
  public name!: string;

  /**
   * 文本框的值，将与表单数据一起提交
   */
  @property()
  public value = '';

  /**
   * 标签文本
   */
  @property()
  public label!: string;

  /**
   * 提示文本
   */
  @property()
  public placeholder!: string;

  /**
   * 文本框底部的帮助文本
   */
  @property()
  public helper!: string;

  /**
   * 是否仅在获得焦点时，显示底部帮助文本
   */
  @property({ type: Boolean, attribute: 'helper-on-focus', reflect: true })
  public helperOnFocus = false;

  /**
   * 验证错误时的错误文本
   */
  @property()
  public error!: string;

  /**
   * 是否可清空文本框
   */
  @property({ type: Boolean })
  public clearable = false;

  /**
   * 文本是否右对齐
   */
  @property({ type: Boolean, attribute: 'end-aligned', reflect: true })
  public endAligned = false;

  /**
   * 文本框的前缀文本。仅在聚焦状态，或文本框有值时才会显示
   */
  @property()
  public prefix!: string;

  /**
   * 文本框的后缀文本。仅在聚焦状态，或文本框有值时才会显示
   */
  @property()
  public suffix!: string;

  /**
   * 文本框的前缀图标
   */
  @property({ attribute: 'prefix-icon' })
  public prefixIcon!: string;

  /**
   * 文本框的后缀图标
   */
  @property({ attribute: 'suffix-icon' })
  public suffixIcon!: string;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property()
  public form!: string;

  /**
   * 是否为只读
   */
  @property({ type: Boolean, reflect: true })
  public readonly = false;

  /**
   * 是否为禁用状态
   */
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 提交表单时，是否必须填写该字段
   */
  @property({ type: Boolean, reflect: true })
  public required = false;

  /**
   * 是否验证未通过
   *
   * 该验证为浏览器原生验证 API，基于 `type`、`required`、`minlength`、`maxlength` 及 `pattern` 等属性的验证结果
   */
  @property({ type: Boolean, reflect: true })
  public invalid = false;

  /**
   * 文本框固定显示的行数
   */
  @property({ type: Number, reflect: true })
  public rows!: number;

  /**
   * 是否根据输入的内容自动调整文本框高度
   */
  @property({ type: Boolean })
  public autosize = false;

  /**
   * autosize 为 true 时，可以通过该属性指定最小行数
   */
  @property({ type: Number, attribute: 'min-rows' })
  public minRows!: number;

  /**
   * autosize 为 true 时，可以通过该属性指定最大行数
   */
  @property({ type: Number, attribute: 'max-rows' })
  public maxRows!: number;

  /**
   * 允许输入的最小字符数
   */
  @property({ type: Number })
  public minlength!: number;

  /**
   * 允许输入的最大字符数
   */
  @property({ type: Number })
  public maxlength!: number;

  /**
   * 是否显示字数统计。必须指定了 maxlength 时，该参数才有效
   */
  @property({ type: Boolean })
  public counter = false;

  /**
   * 当 type 为 number 时，允许输入的最小数值
   */
  @property({ type: Number })
  public min!: number;

  /**
   * 当 type 为 number 时，允许输入的最大数值
   */
  @property({ type: Number })
  public max!: number;

  /**
   * type 为 number 或 range 时，数值在增减过程固定改变的值
   */
  @property({ type: Number })
  public step!: number;

  /**
   * 表单验证的正则表达式
   */
  @property()
  public pattern!: string;

  /**
   * type 为 password 时，设置该属性会添加一个切换按钮，点击时可在密文和明文之间切换
   */
  @property({ type: Boolean, attribute: 'toggle-password' })
  public togglePassword = false;

  /**
   * iOS 的非标准属性（运行在 iOS 上的 Safari、Firefox、Chrome 都支持），文本是否自动首字母大写。在 iOS5 和之后的版本上有效。可选值为：
   * * `none`：禁用首字母大写
   * * `sentences`：句子的首字母大写
   * * `words`：单词或字母的首字母大写
   * * `characters`：全部字母大写
   */
  @property({ reflect: true })
  public autocapitalize!:
    | 'none' /*禁用首字母大写*/
    | 'sentences' /*句子的首字母大写*/
    | 'words' /*单词或字母的首字母大写*/
    | 'characters' /*全部字母大写*/;

  /**
   * input 元素的 autocorrect 属性
   */
  @property()
  public autocorrect!: string;

  /**
   * 是否使用浏览器的记忆功能自动填充文本。可选值为：
   * * `off`：不使用浏览器的记忆自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法
   * * `on`：浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示
   */
  @property({ reflect: true })
  public autocomplete!:
    | 'off' /*不使用浏览器的记忆自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法*/
    | 'on' /*浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示*/;

  /**
   * input 元素的 enterkeyhint 属性。可用于定制虚拟键盘上的 Enter 键的显示状态
   */
  @property({ reflect: true })
  public enterkeyhint!:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send';

  /**
   * 启用拼写检查
   */
  @property({ reflect: true })
  public spellcheck = false;

  /**
   * input 元素的 inputmode 属性。用于定制使用哪种虚拟键盘
   */
  @property({ reflect: true })
  public inputmode!:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';

  get valueAsNumber() {
    return (
      (this.inputElement as HTMLInputElement)?.valueAsNumber ??
      parseFloat(this.value)
    );
  }
  set valueAsNumber(newValue: number) {
    const input = document.createElement('input');
    input.type = 'number';
    input.valueAsNumber = newValue;
    this.value = input.value;
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.setTextareaHeight());

    this.updateComplete.then(() => {
      this.invalid = !this.inputElement.checkValidity();
      this.setTextareaHeight();
      this.resizeObserver.observe(this.inputElement);
    });
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this.inputElement);
  }

  /**
   * 选中文本框中的文本
   */
  public select(): void {
    this.inputElement.select();
  }

  /**
   * 选中文本框中特定范围的内容
   * @param selectionStart 被选中的第一个字符的位置索引，从0开始。如果这个值比元素的 value 长度还大，则会被看作 value 最后一个位置的索引
   * @param selectionEnd 被选中的最后一个字符的*下一个*位置索引。如果这个值比元素的 value 长度还大，则会被看作 value 最后一个位置的索引
   * @param selectionDirection 一个表示选择方向的字符串，可能的值有：* `forward` * `backward` * `none`
   */
  public setSelectionRange(
    selectionStart: number,
    selectionEnd: number,
    selectionDirection: 'forward' | 'backward' | 'none' = 'none',
  ): void {
    this.inputElement.setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection,
    );
  }

  /**
   * 把文本框中特定范围的文本替换成一个新的文本
   * @param replacement
   * @param start
   * @param end
   * @param selectMode
   */
  public setRangeText(
    replacement: string,
    start: number,
    end: number,
    selectMode: 'select' | 'start' | 'end' | 'preserve' = 'preserve',
  ): void {
    this.inputElement.setRangeText(replacement, start, end, selectMode);

    if (this.value !== this.inputElement.value) {
      this.value = this.inputElement.value;
      this.setTextareaHeight();
      emit(this, 'sl-input');
      emit(this, 'sl-change');
    }
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

  protected onChange() {
    this.value = this.inputElement.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    emit(this, 'change');
  }

  protected onClear(event: MouseEvent) {
    this.value = '';
    emit(this, 'clear');
    emit(this, 'input');
    emit(this, 'change');
    this.focus();
    event.stopPropagation();
  }

  protected onInput() {
    this.value = this.inputElement.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    emit(this, 'input');
  }

  protected onInvalid() {
    this.invalid = true;
  }

  protected onKeyDown(event: KeyboardEvent) {
    const hasModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    // 聚焦状态按下回车时，提交表单。可以在 keydown 事件中使用 event.preventDefault() 来取消提交表单
    if (event.key === 'Enter' && !hasModifier) {
      setTimeout(() => {
        if (!event.defaultPrevented) {
          this.formController.submit();
        }
      });
    }
  }

  /**
   * textarea 不支持 pattern 属性，所以在 keyup 时执行验证
   */
  protected onTextAreaKeyUp() {
    const patternRegex = new RegExp(this.pattern);
    const hasError = this.value && !this.value.match(patternRegex);
    this.setCustomValidity(hasError ? '请与请求的格式匹配。' : '');
  }

  protected onTogglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  protected setTextareaHeight() {
    if (this.autosize) {
      this.inputElement.style.height = 'auto';
      this.inputElement.style.height = `${this.inputElement.scrollHeight}px`;
    } else {
      (this.inputElement.style.height as string | undefined) = undefined;
    }
  }

  @watch('disabled', true)
  protected onDisabledChange() {
    // 禁用状态始终为验证通过，所以 disabled 变更时需要重新校验
    this.inputElement.disabled = this.disabled;
    this.invalid = !this.inputElement.checkValidity();
  }

  @watch('value')
  protected onValueChange() {
    this.hasValue = !!this.value;

    if (this.hasUpdated) {
      this.invalid = !this.inputElement.checkValidity();
    }
  }

  @watch('rows', true)
  protected onRowsChange() {
    this.setTextareaHeight();
  }

  @watch('maxRows')
  protected async onMaxRowsChange() {
    if (!this.autosize) {
      return;
    }

    // 设置最大高度，为 line-height * maxRows + padding-top + padding-bottom
    const setMaxHeight = () => {
      const $inputElement = $(this.inputElement);
      $inputElement.css(
        'max-height',
        parseFloat($inputElement.css('line-height')) * this.maxRows +
          parseFloat($inputElement.css('padding-top')) +
          parseFloat($inputElement.css('padding-bottom')),
      );
    };

    if (this.hasUpdated) {
      setMaxHeight();
    } else {
      await this.updateComplete;
      setMaxHeight();
    }
  }

  @watch('minRows')
  protected async onMinRowsChange() {
    if (!this.autosize) {
      return;
    }

    // 设置最小高度，为 line-height * minRows + padding-top + padding-bottom
    const setMinHeight = () => {
      const $inputElement = $(this.inputElement);
      $inputElement.css(
        'min-height',
        parseFloat($inputElement.css('line-height')) * this.minRows +
          parseFloat($inputElement.css('padding-top')) +
          parseFloat($inputElement.css('padding-bottom')),
      );
    };

    if (this.hasUpdated) {
      setMinHeight();
    } else {
      await this.updateComplete;
      setMinHeight();
    }
  }

  protected renderLabel(): TemplateResult {
    return when(
      this.label,
      () =>
        html`<label
          part="label"
          class="label"
          ${animate({
            keyframeOptions: {
              duration: DURATION_SMALL,
              easing: EASING_STANDARD,
            },
          })}
        >
          ${this.label}
        </label>`,
    );
  }

  protected renderPrefix(hasPrefixIcon: boolean): TemplateResult {
    return html`<span
        part="prefix-icon"
        class="prefix-icon ${classMap({ 'has-prefix-icon': hasPrefixIcon })}"
      >
        <slot name="prefix-icon">
          ${when(
            this.prefixIcon,
            () => html`<mdui-icon name=${this.prefixIcon}></mdui-icon>`,
          )}
        </slot>
      </span>
      <span part="prefix" class="prefix">
        <slot name="prefix">${this.prefix}</slot>
      </span>`;
  }

  protected renderSuffix(hasSuffixIcon: boolean): TemplateResult {
    return html`<span part="suffix" class="suffix">
        <slot name="suffix">${this.suffix}</slot>
      </span>
      ${this.invalid
        ? html`<span part="suffix-icon" class="suffix-icon has-suffix-icon">
            <mdui-icon-error></mdui-icon-error>
          </span>`
        : html`<span
            part="suffix-icon"
            class="suffix-icon ${classMap({
              'has-suffix-icon': hasSuffixIcon,
            })}"
          >
            <slot name="suffix-icon">
              ${when(
                this.suffixIcon,
                () => html`<mdui-icon name=${this.suffixIcon}></mdui-icon>`,
              )}
            </slot>
          </span>`} `;
  }

  protected renderClearButton(): TemplateResult {
    const hasClearButton =
      this.clearable &&
      !this.disabled &&
      !this.readonly &&
      (typeof this.value === 'number' || this.value.length > 0);

    return when(
      hasClearButton,
      () =>
        html`<span class="suffix-icon has-suffix-icon">
          <mdui-icon-button
            part="clear-button"
            class="clear"
            tabindex="-1"
            @click=${this.onClear}
          >
            <slot name="clear-icon">
              <mdui-icon-cancel--outlined></mdui-icon-cancel--outlined>
            </slot>
          </mdui-icon-button>
        </span>`,
    );
  }

  protected renderTogglePasswordButton(): TemplateResult {
    return when(
      this.togglePassword && !this.disabled,
      () =>
        html`<span class="suffix-icon has-suffix-icon">
          <mdui-icon-button
            part="toggle-password-button"
            class="toggle-password"
            tabindex="-1"
            @click=${this.onTogglePassword}
          >
            ${this.isPasswordVisible
              ? html`<slot name="show-password-icon">
                  <mdui-icon-visibility-off></mdui-icon-visibility-off>
                </slot>`
              : html`<slot name="hide-password-icon">
                  <mdui-icon-visibility> </mdui-icon-visibility>
                </slot>`}
          </mdui-icon-button>
        </span>`,
    );
  }

  protected renderInput(): TemplateResult {
    return html`<input
      part="input"
      class="input"
      type=${this.type === 'password' && this.isPasswordVisible
        ? 'text'
        : this.type}
      name=${ifDefined(this.name)}
      .value=${live(this.value)}
      placeholder=${ifDefined(
        // @ts-ignore
        !this.label || this.focused || this.hasValue
          ? this.placeholder
          : undefined,
      )}
      ?readonly=${this.readonly}
      ?disabled=${this.disabled}
      ?required=${this.required}
      minlength=${ifDefined(this.minlength)}
      maxlength=${ifDefined(this.maxlength)}
      min=${ifDefined(this.min)}
      max=${ifDefined(this.max)}
      step=${ifDefined(this.step)}
      autocapitalize=${ifDefined(
        this.type === 'password' ? 'off' : this.autocapitalize,
      )}
      autocomplete=${ifDefined(
        this.type === 'password' ? 'off' : this.autocomplete,
      )}
      autocorrect=${ifDefined(
        this.type === 'password' ? 'off' : this.autocorrect,
      )}
      spellcheck=${ifDefined(this.spellcheck)}
      pattern=${ifDefined(this.pattern)}
      enterkeyhint=${ifDefined(this.enterkeyhint)}
      inputmode=${ifDefined(this.inputmode)}
      @change=${this.onChange}
      @input=${this.onInput}
      @invalid=${this.onInvalid}
      @keydown=${this.onKeyDown}
    />`;
  }

  protected renderTextArea(): TemplateResult {
    return html`<textarea
      part="input"
      class="input"
      name=${ifDefined(this.name)}
      .value=${live(this.value)}
      placeholder=${ifDefined(
        // @ts-ignore
        !this.label || this.focused || this.hasValue
          ? this.placeholder
          : undefined,
      )}
      ?readonly=${this.readonly}
      ?disabled=${this.disabled}
      ?required=${this.required}
      minlength=${ifDefined(this.minlength)}
      maxlength=${ifDefined(this.maxlength)}
      rows=${this.rows ?? 1}
      autocapitalize=${ifDefined(this.autocapitalize)}
      autocorrect=${ifDefined(this.autocorrect)}
      spellcheck=${ifDefined(this.spellcheck)}
      enterkeyhint=${ifDefined(this.enterkeyhint)}
      inputmode=${ifDefined(this.inputmode)}
      @change=${this.onChange}
      @input=${this.onInput}
      @invalid=${this.onInvalid}
      @keydown=${this.onKeyDown}
      @keyup=${this.onTextAreaKeyUp}
    ></textarea>`;
  }

  protected renderHelper(): TemplateResult {
    return this.invalid && (this.error || this.inputElement.validationMessage)
      ? html`<div part="error" class="error">
          <slot name="error">
            ${this.error || this.inputElement.validationMessage}
          </slot>
        </div>`
      : html`<div part="helper" class="helper">
          <slot name="helper">${this.helper}</slot>
        </div>`;
  }

  protected renderCounter(): TemplateResult {
    return when(
      this.counter && this.maxlength,
      () =>
        html`<div part="counter" class="counter">
          ${this.value.length}/${this.maxlength}
        </div>`,
    );
  }

  protected override render(): TemplateResult {
    const hasPrefixIcon =
      this.hasSlotController.test('prefix-icon') || !!this.prefixIcon;
    const hasSuffixIcon =
      this.hasSlotController.test('suffix-icon') || !!this.suffixIcon;

    return html`<div
        part="text-field"
        class="text-field ${classMap({
          'has-value': this.hasValue,
          'has-prefix-icon': hasPrefixIcon,
          'has-suffix-icon': hasSuffixIcon,
          'is-firefox': navigator.userAgent.includes('Firefox'),
        })}"
      >
        ${this.renderPrefix(hasPrefixIcon)}
        <div class="input-container">
          ${this.renderLabel()}
          ${this.isTextarea ? this.renderTextArea() : this.renderInput()}
        </div>
        ${this.renderClearButton()}${this.renderTogglePasswordButton()}
        ${this.renderSuffix(hasSuffixIcon)}
      </div>
      <div part="supporting" class="supporting">
        ${this.renderHelper()}${this.renderCounter()}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-text-field': TextField;
  }
}

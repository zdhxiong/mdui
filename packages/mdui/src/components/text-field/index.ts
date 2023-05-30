import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { animate } from '@lit-labs/motion';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../../icons/cancel--outlined.js';
import '../../icons/error.js';
import '../../icons/visibility-off.js';
import '../../icons/visibility.js';
import '../button-icon.js';
import '../icon.js';
import { style } from './style.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

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
export class TextField
  extends FocusableMixin(LitElement)
  implements FormControl
{
  public static override styles: CSSResultGroup = [componentStyle, style];

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
  @property({ reflect: true })
  public name = '';

  /**
   * 文本框的值，将与表单数据一起提交
   */
  @property()
  public value = '';

  /**
   * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
   */
  @defaultValue()
  public defaultValue = '';

  /**
   * 标签文本
   */
  @property({ reflect: true })
  public label?: string;

  /**
   * 提示文本
   */
  @property({ reflect: true })
  public placeholder?: string;

  /**
   * 文本框底部的帮助文本
   */
  @property({ reflect: true })
  public helper?: string;

  /**
   * 是否仅在获得焦点时，显示底部帮助文本
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'helper-on-focus',
  })
  public helperOnFocus = false;

  /**
   * 是否可清空文本框
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public clearable = false;

  /**
   * 文本是否右对齐
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'end-aligned',
  })
  public endAligned = false;

  /**
   * 文本框的前缀文本。仅在聚焦状态，或文本框有值时才会显示
   */
  @property({ reflect: true })
  public prefix!: string;

  /**
   * 文本框的后缀文本。仅在聚焦状态，或文本框有值时才会显示
   */
  @property({ reflect: true })
  public suffix?: string;

  /**
   * 文本框的前缀图标
   */
  @property({ reflect: true, attribute: 'prefix-icon' })
  public prefixIcon?: string;

  /**
   * 文本框的后缀图标
   */
  @property({ reflect: true, attribute: 'suffix-icon' })
  public suffixIcon?: string;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form?: string;

  /**
   * 是否为只读
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public readonly = false;

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
   * 提交表单时，是否必须填写该字段
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public required = false;

  /**
   * 文本框固定显示的行数
   */
  @property({ type: Number, reflect: true })
  public rows?: number;

  /**
   * 是否根据输入的内容自动调整文本框高度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public autosize = false;

  /**
   * autosize 为 true 时，可以通过该属性指定最小行数
   */
  @property({ type: Number, reflect: true, attribute: 'min-rows' })
  public minRows?: number;

  /**
   * autosize 为 true 时，可以通过该属性指定最大行数
   */
  @property({ type: Number, reflect: true, attribute: 'max-rows' })
  public maxRows?: number;

  /**
   * 允许输入的最小字符数
   */
  @property({ type: Number, reflect: true })
  public minlength?: number;

  /**
   * 允许输入的最大字符数
   */
  @property({ type: Number, reflect: true })
  public maxlength?: number;

  /**
   * 是否显示字数统计。必须指定了 maxlength 时，该参数才有效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public counter = false;

  /**
   * 当 type 为 number 时，允许输入的最小数值
   */
  @property({ type: Number, reflect: true })
  public min?: number;

  /**
   * 当 type 为 number 时，允许输入的最大数值
   */
  @property({ type: Number, reflect: true })
  public max?: number;

  /**
   * type 为 number 或 range 时，数值在增减过程固定改变的值
   */
  @property({ type: Number, reflect: true })
  public step?: number;

  /**
   * 表单验证的正则表达式
   */
  @property({ reflect: true })
  public pattern?: string;

  /**
   * type 为 password 时，设置该属性会添加一个切换按钮，点击时可在密文和明文之间切换
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'toggle-password',
  })
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
  @property({ reflect: true })
  public autocorrect?: string;

  /**
   * 是否使用浏览器的记忆功能自动填充文本。可选值为：
   * * `off`：不使用浏览器的记忆自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法
   * * `on`：浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示
   */
  @property({ reflect: true })
  public autocomplete?:
    | 'off' /*不使用浏览器的记忆自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法*/
    | 'on' /*浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示*/;

  /**
   * input 元素的 enterkeyhint 属性。可用于定制虚拟键盘上的 Enter 键的显示状态
   */
  @property({ reflect: true })
  public enterkeyhint?:
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
  public inputmode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';

  /**
   * 是否验证未通过
   *
   * 该验证为浏览器原生验证 API，基于 `type`、`required`、`minlength`、`maxlength` 及 `pattern` 等属性的验证结果
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private invalid = false;

  /**
   * 该属性设置为 true 时，则在样式上为 text-field 赋予聚焦状态。实际是否聚焦仍然由 focusableMixin 控制
   * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'focused-style',
  })
  private focusedStyle = false;

  @state()
  private isPasswordVisible = false;

  @state()
  private hasValue = false;

  /**
   * 通过该属性传入了错误文案时，会优先显示该文案。需要配合 invalid=true 使用
   * 当前仅供 select 组件使用
   */
  @state()
  private error = '';

  private observeResize?: ObserveResize;
  private readonly inputRef: Ref<HTMLInputElement | HTMLTextAreaElement> =
    createRef();
  private readonly formController: FormController = new FormController(this);
  private readonly hasSlotController = new HasSlotController(
    this,
    'prefix-icon',
    'suffix-icon',
    'input', // input 仅供 <mdui-select> 使用，文档中不写该 slot
  );

  /**
   * 该属性设为 true 时，即使设置了 readonly，仍可以显示 clearable
   * 当前仅供 select 组件使用
   */
  private readonlyButClearable = false;

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

  /**
   * 获取当前值，并转换为 `number` 类型；或设置一个 `number` 类型的值。
   * 如果值无法被转换为 `number` 类型，则会返回 `NaN`。
   */
  public get valueAsNumber(): number {
    return (
      (this.inputRef.value as HTMLInputElement)?.valueAsNumber ??
      parseFloat(this.value)
    );
  }
  public set valueAsNumber(newValue: number) {
    const input = document.createElement('input');
    input.type = 'number';
    input.valueAsNumber = newValue;
    this.value = input.value;
  }

  protected override get focusElement(): HTMLElement {
    return this.inputRef.value!;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled;
  }

  /**
   * 是否显示聚焦状态样式
   */
  private get isFocusedStyle(): boolean {
    // @ts-ignore
    return this.focused || this.focusedStyle;
  }

  /**
   * 是否渲染为 textarea。为 false 时渲染为 input
   */
  private get isTextarea() {
    return (this.rows && this.rows > 1) || this.autosize;
  }

  @watch('disabled', true)
  private onDisabledChange() {
    // 禁用状态始终为验证通过，所以 disabled 变更时需要重新校验
    this.inputRef.value!.disabled = this.disabled;
    this.invalid = !this.inputRef.value!.checkValidity();
  }

  @watch('value')
  private async onValueChange() {
    this.hasValue = !!this.value;

    if (this.hasUpdated) {
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
  }

  @watch('rows', true)
  private onRowsChange() {
    this.setTextareaHeight();
  }

  @watch('maxRows')
  private async onMaxRowsChange() {
    if (!this.autosize) {
      return;
    }

    // 设置最大高度，为 line-height * maxRows + padding-top + padding-bottom
    const setMaxHeight = () => {
      const $input = $(this.inputRef.value!);
      $input.css(
        'max-height',
        parseFloat($input.css('line-height')) * (this.maxRows ?? 1) +
          parseFloat($input.css('padding-top')) +
          parseFloat($input.css('padding-bottom')),
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
  private async onMinRowsChange() {
    if (!this.autosize) {
      return;
    }

    // 设置最小高度，为 line-height * minRows + padding-top + padding-bottom
    const setMinHeight = () => {
      const $input = $(this.inputRef.value!);
      $input.css(
        'min-height',
        parseFloat($input.css('line-height')) * (this.minRows ?? 1) +
          parseFloat($input.css('padding-top')) +
          parseFloat($input.css('padding-bottom')),
      );
    };

    if (this.hasUpdated) {
      setMinHeight();
    } else {
      await this.updateComplete;
      setMinHeight();
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.updateComplete.then(() => {
      this.setTextareaHeight();
      this.observeResize = observeResize(this.inputRef.value!, () =>
        this.setTextareaHeight(),
      );
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
  }

  /**
   * 选中文本框中的文本
   */
  public select(): void {
    this.inputRef.value!.select();
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
    this.inputRef.value!.setSelectionRange(
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
    this.inputRef.value!.setRangeText(replacement, start, end, selectMode);

    if (this.value !== this.inputRef.value!.value) {
      this.value = this.inputRef.value!.value;
      this.setTextareaHeight();
      emit(this, 'input');
      emit(this, 'change');
    }
  }

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
      emit(this, 'invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });

      this.focus();
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

  protected override render(): TemplateResult {
    const hasPrefixIcon =
      this.hasSlotController.test('prefix-icon') || !!this.prefixIcon;
    const hasSuffixIcon =
      this.hasSlotController.test('suffix-icon') || !!this.suffixIcon;
    // 存在 input slot 时，隐藏组件内部的 .input 元素，使用 slot 代替
    const hasInputSlot = this.hasSlotController.test('input');

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
          ${this.isTextarea
            ? this.renderTextArea(hasInputSlot)
            : this.renderInput(hasInputSlot)}
          ${when(
            hasInputSlot,
            () => html`<slot name="input" class="input"></slot>`,
          )}
        </div>
        ${this.renderClearButton()}${this.renderTogglePasswordButton()}
        ${this.renderSuffix(hasSuffixIcon)}
      </div>
      ${when(
        (this.invalid &&
          (this.error || this.inputRef.value!.validationMessage)) ||
          this.helper ||
          (this.counter && this.maxlength),
        () => html`<div part="supporting" class="supporting">
          ${this.renderHelper()}${this.renderCounter()}
        </div>`,
      )}`;
  }

  private onChange() {
    this.value = this.inputRef.value!.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    emit(this, 'change');
  }

  private onClear(event: MouseEvent) {
    this.value = '';
    emit(this, 'clear');
    emit(this, 'input');
    emit(this, 'change');
    this.focus();
    event.stopPropagation();
  }

  private onInput() {
    this.value = this.inputRef.value!.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    emit(this, 'input');
  }

  private onInvalid(event: Event) {
    event.preventDefault();
  }

  private onKeyDown(event: KeyboardEvent) {
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
  private onTextAreaKeyUp() {
    if (this.pattern) {
      const patternRegex = new RegExp(this.pattern);
      const hasError = this.value && !this.value.match(patternRegex);
      this.setCustomValidity(hasError ? '请与请求的格式匹配。' : '');
    }
  }

  private onTogglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private setTextareaHeight() {
    if (this.autosize) {
      this.inputRef.value!.style.height = 'auto';
      this.inputRef.value!.style.height = `${
        this.inputRef.value!.scrollHeight
      }px`;
    } else {
      (this.inputRef.value!.style.height as string | undefined) = undefined;
    }
  }

  private renderLabel(): TemplateResult {
    return this.label
      ? html`<label
          part="label"
          class="label"
          ${animate({
            keyframeOptions: {
              duration: getDuration(this, 'short4'),
              easing: getEasing(this, 'standard'),
            },
          })}
        >
          ${this.label}
        </label>`
      : nothingTemplate;
  }

  private renderPrefix(hasPrefixIcon: boolean): TemplateResult {
    return html`<span
        part="prefix-icon"
        class="prefix-icon ${classMap({ 'has-prefix-icon': hasPrefixIcon })}"
      >
        <slot name="prefix-icon">
          ${this.prefixIcon
            ? html`<mdui-icon name=${this.prefixIcon}></mdui-icon>`
            : nothingTemplate}
        </slot>
      </span>
      <span part="prefix" class="prefix">
        <slot name="prefix">${this.prefix}</slot>
      </span>`;
  }

  private renderSuffix(hasSuffixIcon: boolean): TemplateResult {
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
              ${this.suffixIcon
                ? html`<mdui-icon name=${this.suffixIcon}></mdui-icon>`
                : nothingTemplate}
            </slot>
          </span>`} `;
  }

  private renderClearButton(): TemplateResult {
    const hasClearButton =
      this.clearable &&
      !this.disabled &&
      (!this.readonly || this.readonlyButClearable) &&
      (typeof this.value === 'number' || this.value.length > 0);

    return when(
      hasClearButton,
      () =>
        html`<span class="suffix-icon has-suffix-icon">
          <mdui-button-icon
            part="clear-button"
            class="clear"
            tabindex="-1"
            @click=${this.onClear}
          >
            <slot name="clear-icon">
              <mdui-icon-cancel--outlined></mdui-icon-cancel--outlined>
            </slot>
          </mdui-button-icon>
        </span>`,
    );
  }

  private renderTogglePasswordButton(): TemplateResult {
    return when(
      this.type === 'password' && this.togglePassword && !this.disabled,
      () =>
        html`<span class="suffix-icon has-suffix-icon">
          <mdui-button-icon
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
          </mdui-button-icon>
        </span>`,
    );
  }

  private renderInput(hasInputSlot: boolean): TemplateResult {
    return html`<input
      ${ref(this.inputRef)}
      part="input"
      class="input ${classMap({ 'hide-input': hasInputSlot })}"
      type=${this.type === 'password' && this.isPasswordVisible
        ? 'text'
        : this.type}
      name=${ifDefined(this.name)}
      .value=${live(this.value)}
      placeholder=${ifDefined(
        // @ts-ignore
        !this.label || this.isFocusedStyle || this.hasValue
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

  private renderTextArea(hasInputSlot: boolean): TemplateResult {
    return html`<textarea
      ${ref(this.inputRef)}
      part="input"
      class="input ${classMap({ 'hide-input': hasInputSlot })}"
      name=${ifDefined(this.name)}
      .value=${live(this.value)}
      placeholder=${ifDefined(
        // @ts-ignore
        !this.label || this.isFocusedStyle || this.hasValue
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

  private renderHelper(): TemplateResult {
    return this.invalid &&
      (this.error || this.inputRef.value!.validationMessage)
      ? html`<div part="error" class="error">
          ${this.error || this.inputRef.value!.validationMessage}
        </div>`
      : this.helper
      ? html`<div part="helper" class="helper">
          <slot name="helper">${this.helper}</slot>
        </div>`
      : nothingTemplate;
  }

  private renderCounter(): TemplateResult {
    return this.counter && this.maxlength
      ? html`<div part="counter" class="counter">
          ${this.value.length}/${this.maxlength}
        </div>`
      : nothingTemplate;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-text-field': TextField;
  }
}

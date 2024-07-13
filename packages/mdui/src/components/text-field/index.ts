import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { msg } from '@lit/localize';
import { animate } from '@lit-labs/motion';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/cancel--outlined.js';
import '@mdui/shared/icons/error.js';
import '@mdui/shared/icons/visibility-off.js';
import '@mdui/shared/icons/visibility.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { onLocaleReady, offLocaleReady } from '../../internal/localize.js';
import '../button-icon.js';
import '../icon.js';
import { style } from './style.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 文本框组件
 *
 * ```html
 * <mdui-text-field label="Text Field"></mdui-text-field>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在文本框的值变更，且失去焦点时触发
 * @event input - 在文本框的值变更时触发
 * @event invalid - 表单字段验证不通过时触发
 * @event clear - 在点击由 `clearable` 属性生成的清空按钮时触发。可以通过调用 `event.preventDefault()` 阻止清空文本框
 *
 * @slot icon - 左侧图标
 * @slot end-icon - 右侧图标
 * @slot error-icon - 验证失败状态的右侧图标
 * @slot prefix - 左侧文本
 * @slot suffix - 右侧文本
 * @slot clear-button - 清空按钮
 * @slot clear-icon - 清空按钮中的图标
 * @slot toggle-password-button - 密码显示状态切换按钮
 * @slot show-password-icon - 显示密码状态下，密码显示状态切换按钮中的图标
 * @slot hide-password-icon - 隐藏密码状态下，密码显示状态切换按钮中的图标
 * @slot helper - 底部的帮助文本
 *
 * @csspart container - 文本框容器
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart error-icon - 验证失败状态的右侧图标
 * @csspart prefix - 左侧文本
 * @csspart suffix - 右侧文本
 * @csspart label - 上方的标签文本
 * @csspart input - 内部的 `<input>` 或 `<textarea>` 元素
 * @csspart clear-button - 清空按钮
 * @csspart clear-icon - 清空按钮中的图标
 * @csspart toggle-password-button - 密码显示状态切换按钮
 * @csspart show-password-icon - 显示密码状态下，密码显示状态切换按钮中的图标
 * @csspart hide-password-icon - 隐藏密码状态下，密码显示状态切换按钮中的图标
 * @csspart supporting - 底部辅助信息容器，包括 helper、error、counter
 * @csspart helper - 底部的帮助文本
 * @csspart error - 底部的错误描述文本
 * @csspart counter - 底部右侧的字数统计
 */
@customElement('mdui-text-field')
export class TextField
  extends FocusableMixin(MduiElement)<TextFieldEventMap>
  implements FormControl
{
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 文本框的形状。默认为 `filled`。可选值包括：
   *
   * * `filled`：带背景色的文本框，视觉效果较强
   * * `outlined`：带边框的文本框，视觉效果较弱
   */
  @property({ reflect: true })
  public variant:
    | /*带背景色的文本框，视觉效果较强*/ 'filled'
    | /*带边框的文本框，视觉效果较弱*/ 'outlined' = 'filled';

  /**
   * 文本框输入类型。默认为 `text`。可选值包括：
   *
   * * `text`：默认值。文本字段
   * * `number`：只能输入数字。拥有动态键盘的设备上会显示数字键盘
   * * `password`：用于输入密码，其值会被遮盖
   * * `url`：用于输入 URL，会验证 URL 格式。在支持动态键盘的设备上有相应的键盘
   * * `email`：用于输入邮箱地址，会验证邮箱格式。在支持动态键盘的设备上有相应的键盘
   * * `search`：用于搜索框。拥有动态键盘的设备上的回车图标会变成搜索图标
   * * `tel`：用于输入电话号码。拥有动态键盘的设备上会显示电话数字键盘
   * * `hidden`：隐藏该控件，但其值仍会提交到服务器
   * * `date`：输入日期的控件（年、月、日，不包括时间）。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
   * * `datetime-local`：输入日期和时间的控件，不包括时区。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
   * * `month`：输入年和月的控件，没有时区
   * * `time`：用于输入时间的控件，不包括时区
   * * `week`：用于输入以年和周数组成的日期，不带时区
   */
  @property({ reflect: true })
  public type:
    | /*默认值。文本字段*/ 'text'
    | /*只能输入数字。拥有动态键盘的设备上会显示数字键盘*/ 'number'
    | /*用于输入密码，其值会被遮盖*/ 'password'
    | /*用于输入 URL，会验证 URL 格式。在支持动态键盘的设备上有相应的键盘*/ 'url'
    | /*用于输入邮箱地址，会验证邮箱格式。在支持动态键盘的设备上有相应的键盘*/ 'email'
    | /*用于搜索框。拥有动态键盘的设备上的回车图标会变成搜索图标*/ 'search'
    | /*用于输入电话号码。拥有动态键盘的设备上会显示电话数字键盘*/ 'tel'
    | /*隐藏该控件，但其值仍会提交到服务器*/ 'hidden'
    | /*输入日期的控件（年、月、日，不包括时间）。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮*/ 'date'
    | /*输入日期和时间的控件，不包括时区。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮*/ 'datetime-local'
    | /*输入年和月的控件，没有时区*/ 'month'
    | /*用于输入时间的控件，不包括时区*/ 'time'
    | /*用于输入以年和周数组成的日期，不带时区*/ 'week' = 'text';

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
   * 占位符文本
   */
  @property({ reflect: true })
  public placeholder?: string;

  /**
   * 文本框底部的帮助文本。也可以通过 `slot="helper"` 设置
   */
  @property({ reflect: true })
  public helper?: string;

  /**
   * 是否仅在获得焦点时，显示底部的帮助文本
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'helper-on-focus',
  })
  public helperOnFocus = false;

  /**
   * 是否可清空文本框内容
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public clearable = false;

  /**
   * 可清空文本框时，显示在文本框右侧的清空按钮的 Material Icons 图标名。也可以通过 `slot="clear-icon"` 设置
   */
  @property({ reflect: true, attribute: 'clear-icon' })
  public clearIcon?: string;

  /**
   * 是否将文本右对齐
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'end-aligned',
  })
  public endAligned = false;

  /**
   * 文本框的前缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="prefix"` 设置
   */
  @property({ reflect: true })
  public prefix!: string;

  /**
   * 文本框的后缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="suffix"` 设置
   */
  @property({ reflect: true })
  public suffix?: string;

  /**
   * 文本框的前缀图标的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 文本框的后缀图标的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  /**
   * 表单字段验证失败时，显示在文本框右侧的 Material Icons 图标名。也可以通过 `slot="error-icon"` 设置
   */
  @property({ reflect: true, attribute: 'error-icon' })
  public errorIcon?: string;

  /**
   * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
   *
   * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
   */
  @property({ reflect: true })
  public form?: string;

  /**
   * 是否为只读模式
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public readonly = false;

  /**
   * 是否禁用输入框
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
   * 文本框的固定显示行数
   */
  @property({ type: Number, reflect: true })
  public rows?: number;

  /**
   * 是否根据输入内容自动调整文本框高度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public autosize = false;

  /**
   * `autosize` 为 `true` 时，文本框的最小行数
   */
  @property({ type: Number, reflect: true, attribute: 'min-rows' })
  public minRows?: number;

  /**
   * `autosize` 为 `true` 时，文本框的最大行数
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
   * 是否显示字数统计，只在 `maxlength` 被指定时有效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public counter = false;

  /**
   * 当 `type` 为 `number` 时，允许输入的最小数值
   */
  @property({ type: Number, reflect: true })
  public min?: number;

  /**
   * 当 `type` 为 `number` 时，允许输入的最大数值
   */
  @property({ type: Number, reflect: true })
  public max?: number;

  /**
   * `type` 为 `number` 时，数值增减的步长
   */
  @property({ type: Number, reflect: true })
  public step?: number;

  /**
   * 用于表单验证的正则表达式
   */
  @property({ reflect: true })
  public pattern?: string;

  /**
   * `type` 为 `password` 时，设置此属性会添加一个切换按钮，用于在明文和密文之间切换
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'toggle-password',
  })
  public togglePassword = false;

  /**
   * 密码切换按钮的 Material Icons 图标，当密码为明文时显示。也可以通过 `slot="show-password-icon"` 设置
   */
  @property({ reflect: true, attribute: 'show-password-icon' })
  public showPasswordIcon?: string;

  /**
   * 密码切换按钮的 Material Icons 图标，当密码为密文时显示。也可以通过 `slot="hide-password-icon"` 设置
   */
  @property({ reflect: true, attribute: 'hide-password-icon' })
  public hidePasswordIcon?: string;

  /**
   * iOS 的非标准属性，用于控制文本首字母是否自动大写。在 iOS5 及以后的版本上有效。可选值包括：
   *
   * * `none`：禁用首字母大写
   * * `sentences`：句子首字母大写
   * * `words`：单词首字母大写
   * * `characters`：所有字母大写
   */
  @property({ reflect: true })
  public autocapitalize!:
    | /*禁用首字母大写*/ 'none'
    | /*句子首字母大写*/ 'sentences'
    | /*单词首字母大写*/ 'words'
    | /*所有字母大写*/ 'characters';

  /**
   * `input` 元素的 `autocorrect` 属性
   */
  @property({ reflect: true })
  public autocorrect?: string;

  /**
   * 是否使用浏览器的自动填充功能。可选值包括：
   *
   * * `off`：禁用浏览器的自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法
   * * `on`：浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示
   */
  @property({ reflect: true })
  public autocomplete?:
    | /*禁用浏览器的自动填充，使用者必须输入他们想要输入的所有内容。或者网页提供了自己的自动填充方法*/ 'off'
    | /*浏览器根据用户之前输入的内容或者习惯，在用户输入的时候给出相应输入提示*/ 'on';

  /**
   * `input` 元素的 `enterkeyhint` 属性，用于定制虚拟键盘上的 Enter 键的显示文本或图标。具体显示效果取决于用户使用的设备和语言。可选值包括：
   *
   * * `enter`：插入新行
   * * `done`：完成输入，关闭虚拟键盘
   * * `go`：导航到输入文本的目标
   * * `next`：移动到下一个输入项
   * * `previous`：移动到上一个输入项
   * * `search`：导航到搜索结果
   * * `send`：发送文本信息
   */
  @property({ reflect: true })
  public enterkeyhint?:
    | /*插入新行*/ 'enter'
    | /*完成输入，关闭虚拟键盘*/ 'done'
    | /*导航到输入文本的目标*/ 'go'
    | /*移动到下一个输入项*/ 'next'
    | /*移动到上一个输入项*/ 'previous'
    | /*导航到搜索结果*/ 'search'
    | /*发送文本信息*/ 'send';

  /**
   * 是否启用拼写检查
   */
  @property({ type: Boolean, reflect: true, converter: booleanConverter })
  public spellcheck = false;

  /**
   * `input` 元素的 `inputmode` 属性，用于定制虚拟键盘的类型。可选值包括：
   *
   * * `none`：无虚拟键盘。在需要实现自己的键盘输入控件时很有用
   * * `text`：标准文本输入键盘
   * * `decimal`：小数输入键盘，除了数字之外可能会有小数点 `.` 或者千分符逗号 `,`
   * * `numeric`：显示 0-9 的数字键盘
   * * `tel`：手机数字键盘，包含 0-9 数字、星号 `*` 或者井号 `#` 键
   * * `search`：为搜索输入优化的虚拟键盘，提交按钮通常会显示 `search` 或者 “搜索”
   * * `email`：为邮件地址输入优化的虚拟键盘，通常会有 `@ .` 等键
   * * `url`：为 URL 输入优化的虚拟键盘，通常会有 `. / #` 等键
   */
  @property({ reflect: true })
  public inputmode?:
    | /*无虚拟键盘。在需要实现自己的键盘输入控件时很有用*/ 'none'
    | /*标准文本输入键盘*/ 'text'
    | /*小数输入键盘，除了数字之外可能会有小数点 `.` 或者千分符逗号 `,`*/ 'decimal'
    | /*显示 0-9 的数字键盘*/ 'numeric'
    | /*手机数字键盘，包含 0-9 数字、星号 `*` 或者井号 `#` 键*/ 'tel'
    | /*为搜索输入优化的虚拟键盘，提交按钮通常会显示 `search` 或者 “搜索”*/ 'search'
    | /*为邮件地址输入优化的虚拟键盘，通常会有 `@ .` 等键*/ 'email'
    | /*为 URL 输入优化的虚拟键盘，通常会有 `. / #` 等键*/ 'url';

  /**
   * 是否验证未通过
   *
   * 该验证为浏览器原生验证 API，基于 `type`、`required`、`minlength`、`maxlength` 及 `pattern` 等属性的验证结果
   */
  @state()
  private invalid = false;

  /**
   * 该属性设置为 true 时，则在样式上为 text-field 赋予 invalid 的状态。实际是否验证通过仍需根据 invalid 属性判断
   * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
   */
  @state()
  private invalidStyle = false;

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
   * 通过该属性传入了错误文案时，会优先显示该文案。需要配合 invalid=true 或 invalidStyle=true 使用
   * 当前仅供 select 组件使用
   */
  @state()
  private error = '';

  private observeResize?: ObserveResize;
  private readonly inputRef: Ref<HTMLInputElement | HTMLTextAreaElement> =
    createRef();
  private readonly formController = new FormController(this);
  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'end-icon',
    'helper',
    'input', // input 仅供 <mdui-select> 使用，文档中不写该 slot
  );

  /**
   * 该属性设为 true 时，即使设置了 readonly，仍可以显示 clearable
   * 当前仅供 select 组件使用
   */
  private readonlyButClearable = false;

  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  public get validity(): ValidityState {
    return this.inputRef.value!.validity;
  }

  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
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
    this.hasValue = !['', null].includes(this.value);

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

    if (!this.hasUpdated) {
      await this.updateComplete;
    }

    // 设置最大高度，为 line-height * maxRows + padding-top + padding-bottom
    const $input = $(this.inputRef.value!);
    $input.css(
      'max-height',
      parseFloat($input.css('line-height')) * (this.maxRows ?? 1) +
        parseFloat($input.css('padding-top')) +
        parseFloat($input.css('padding-bottom')),
    );
  }

  @watch('minRows')
  private async onMinRowsChange() {
    if (!this.autosize) {
      return;
    }

    if (!this.hasUpdated) {
      await this.updateComplete;
    }

    // 设置最小高度，为 line-height * minRows + padding-top + padding-bottom
    const $input = $(this.inputRef.value!);
    $input.css(
      'min-height',
      parseFloat($input.css('line-height')) * (this.minRows ?? 1) +
        parseFloat($input.css('padding-top')) +
        parseFloat($input.css('padding-bottom')),
    );
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observeResize?.unobserve();
    offLocaleReady(this);
  }

  /**
   * 选中文本框中的文本
   */
  public select(): void {
    this.inputRef.value!.select();
  }

  /**
   * 选中文本框中特定范围的内容
   *
   * @param start 被选中的第一个字符的位置索引，从 `0` 开始。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
   * @param end 被选中的最后一个字符的*下一个*位置索引。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
   * @param direction 一个表示选择方向的字符串，可能的值有：`forward`、`backward`、`none`
   */
  public setSelectionRange(
    start: number,
    end: number,
    direction: 'forward' | 'backward' | 'none' = 'none',
  ): void {
    this.inputRef.value!.setSelectionRange(start, end, direction);
  }

  /**
   * 将文本框中特定范围的文本替换为新的文本
   * @param replacement 要插入的字符串
   * @param start 要替换的字符的起止位置的索引。默认为当前用户选中的字符的起始位置的索引
   * @param end 要替换的字符的结束位置的索引。默认为当前用户选中的字符的结束位置的索引
   * @param selectMode 文本被替换后，选取的状态。可选值为：
   * * `select`：选择新插入的文本
   * * `start`：将光标移动到新插入的文本的起始位置
   * * `end`：将光标移动到新插入的文本的结束位置
   * * `preserve`：默认值。尝试保留选取
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
      this.emit('input');
      this.emit('change');
    }
  }

  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  public checkValidity(): boolean {
    const valid = this.inputRef.value!.checkValidity();

    if (!valid) {
      this.emit('invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });
    }

    return valid;
  }

  /**
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  public reportValidity(): boolean {
    this.invalid = !this.inputRef.value!.reportValidity();

    if (this.invalid) {
      this.emit('invalid', {
        bubbles: false,
        cancelable: true,
        composed: false,
      });

      this.focus();
    }

    return !this.invalid;
  }

  /**
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
   */
  public setCustomValidity(message: string): void {
    this.setCustomValidityInternal(message);

    // 外部调用 setCustomValidity 时，不再使用内置的验证规则，所以需要移除监听语言变更事件
    offLocaleReady(this);
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.setTextareaHeight();
    this.observeResize = observeResize(this.inputRef.value!, () =>
      this.setTextareaHeight(),
    );
  }

  protected override render(): TemplateResult {
    const hasIcon = !!this.icon || this.hasSlotController.test('icon');
    const hasEndIcon =
      !!this.endIcon || this.hasSlotController.test('end-icon');
    const hasErrorIcon = this.invalid || this.invalidStyle;
    const hasHelper = !!this.helper || this.hasSlotController.test('helper');
    const hasError =
      hasErrorIcon && !!(this.error || this.inputRef.value!.validationMessage);
    const hasCounter = this.counter && !!this.maxlength;

    // 存在 input slot 时，隐藏组件内部的 .input 元素，使用 slot 代替
    const hasInputSlot = this.hasSlotController.test('input');

    const invalidClassNameObj = {
      invalid: this.invalid,
      'invalid-style': this.invalidStyle,
    };
    const className = classMap({
      container: true,
      'has-value': this.hasValue,
      'has-icon': hasIcon,
      'has-end-icon': hasEndIcon,
      'has-error-icon': hasErrorIcon,
      'is-firefox': navigator.userAgent.includes('Firefox'),
      ...invalidClassNameObj,
    });

    return html`<div part="container" class=${className}>
        ${this.renderPrefix()}
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
        ${this.renderSuffix(hasErrorIcon)}
      </div>
      ${when(
        hasError || hasHelper || hasCounter,
        () =>
          html`<div
            part="supporting"
            class=${classMap({ supporting: true, ...invalidClassNameObj })}
          >
            ${this.renderHelper(hasError, hasHelper)}
            ${this.renderCounter(hasCounter)}
          </div>`,
      )}`;
  }

  private setCustomValidityInternal(message: string): void {
    this.inputRef.value!.setCustomValidity(message);
    this.invalid = !this.inputRef.value!.checkValidity();
    this.requestUpdate();
  }

  private onChange() {
    this.value = this.inputRef.value!.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    this.emit('change');
  }

  private onClear(event: MouseEvent) {
    this.value = '';
    this.emit('clear');
    this.emit('input');
    this.emit('change');
    this.focus();
    event.stopPropagation();
  }

  private onInput() {
    this.value = this.inputRef.value!.value;
    if (this.isTextarea) {
      this.setTextareaHeight();
    }
    this.emit('input');
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

      if (hasError) {
        this.setCustomValidityInternal(this.getPatternErrorMsg());
        onLocaleReady(this, () => {
          this.setCustomValidityInternal(this.getPatternErrorMsg());
        });
      } else {
        this.setCustomValidityInternal('');
        offLocaleReady(this);
      }
    }
  }

  private onTogglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private getPatternErrorMsg() {
    return msg('Please match the requested format.', {
      id: 'components.textField.patternError',
    });
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

  private renderPrefix(): TemplateResult {
    return html`<slot name="icon" part="icon" class="icon">
        ${this.icon
          ? html`<mdui-icon name=${this.icon} class="i"></mdui-icon>`
          : nothingTemplate}
      </slot>
      <slot name="prefix" part="prefix" class="prefix">${this.prefix}</slot>`;
  }

  private renderSuffix(hasErrorIcon: boolean): TemplateResult {
    return html`<slot name="suffix" part="suffix" class="suffix">
        ${this.suffix}
      </slot>
      ${hasErrorIcon
        ? html`<slot name="error-icon" part="error-icon" class="right-icon">
            ${this.errorIcon
              ? html`<mdui-icon name=${this.errorIcon} class="i"></mdui-icon>`
              : html`<mdui-icon-error class="i"></mdui-icon-error>`}
          </slot>`
        : html`<slot
            name="end-icon"
            part="end-icon"
            class="end-icon right-icon"
          >
            ${this.endIcon
              ? html`<mdui-icon name=${this.endIcon} class="i"></mdui-icon>`
              : nothingTemplate}
          </slot>`}`;
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
        html`<slot
          name="clear-button"
          part="clear-button"
          class="right-icon"
          @click=${this.onClear}
        >
          <mdui-button-icon tabindex="-1">
            <slot name="clear-icon" part="clear-icon">
              ${this.clearIcon
                ? html`<mdui-icon name=${this.clearIcon} class="i"></mdui-icon>`
                : html`<mdui-icon-cancel--outlined
                    class="i"
                  ></mdui-icon-cancel--outlined>`}
            </slot>
          </mdui-button-icon>
        </slot>`,
    );
  }

  private renderTogglePasswordButton(): TemplateResult {
    const hasTogglePasswordButton =
      this.type === 'password' && this.togglePassword && !this.disabled;

    return when(
      hasTogglePasswordButton,
      () =>
        html`<slot
          name="toggle-password-button"
          part="toggle-password-button"
          class="right-icon"
          @click=${this.onTogglePassword}
        >
          <mdui-button-icon tabindex="-1">
            ${this.isPasswordVisible
              ? html`<slot name="show-password-icon" part="show-password-icon">
                  ${this.showPasswordIcon
                    ? html`<mdui-icon
                        name=${this.showPasswordIcon}
                        class="i"
                      ></mdui-icon>`
                    : html`<mdui-icon-visibility-off
                        class="i"
                      ></mdui-icon-visibility-off>`}
                </slot>`
              : html`<slot name="hide-password-icon" part="hide-password-icon">
                  ${this.hidePasswordIcon
                    ? html`<mdui-icon
                        name=${this.hidePasswordIcon}
                        class="i"
                      ></mdui-icon>`
                    : html`<mdui-icon-visibility
                        class="i"
                      ></mdui-icon-visibility>`}
                </slot>`}
          </mdui-button-icon>
        </slot>`,
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

  /**
   * @param hasError 是否包含错误提示
   * @param hasHelper 是否含 helper 属性或 helper slot
   */
  private renderHelper(hasError: boolean, hasHelper: boolean): TemplateResult {
    return hasError
      ? html`<div part="error" class="error">
          ${this.error || this.inputRef.value!.validationMessage}
        </div>`
      : hasHelper
        ? html`<slot name="helper" part="helper" class="helper">
            ${this.helper}
          </slot>`
        : // 右边有 counter，需要占位
          html`<span></span>`;
  }

  private renderCounter(hasCounter: boolean): TemplateResult {
    return hasCounter
      ? html`<div part="counter" class="counter">
          ${this.value.length}/${this.maxlength}
        </div>`
      : nothingTemplate;
  }
}

export interface TextFieldEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
  input: CustomEvent<void>;
  invalid: CustomEvent<void>;
  clear: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-text-field': TextField;
  }
}

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import type { TextField } from '../text-field.js';
import { style } from './style.js';
import '../chip.js';
import '../dropdown.js';
import '../menu.js';
import '../text-field.js';

/**
 * @event click
 * @event focus
 * @event blur
 * @event change
 * @event invalid
 * @event clear - 在点击由 clearable 属性生成的清空按钮时触发。可以通过调用 `event.preventDefault()` 阻止清空下拉框
 *
 * @slot - `<mdui-menu-item>` 元素
 * @slot prefix-icon
 * @slot prefix
 * @slot suffix
 * @slot suffix-icon
 * @slot clear-icon
 * @slot helper
 * @slot error
 */
@customElement('mdui-select')
export class Select extends FocusableMixin(LitElement) {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('.text-field')
  protected textFieldElement!: TextField;

  protected get focusDisabled(): boolean {
    return this.disabled;
  }

  protected get focusElement(): HTMLElement {
    return this.textFieldElement;
  }

  protected readonly formController: FormController = new FormController(this);

  /**
   * 下拉框形状。可选值为：
   * * `filled`
   * * `outlined`
   */
  @property({ reflect: true })
  public variant: 'filled' /*预览图*/ | 'outlined' /*预览图*/ = 'filled';

  /**
   * 是否支持多选
   */
  @property({ type: Boolean, reflect: true })
  public multiple = false;

  /**
   * 下拉框名称，将与表单数据一起提交
   */
  @property()
  public name!: string;

  /**
   * 下拉框的值，将与表单数据一起提交。
   *
   * 若未指定 `multiple` 属性，则该值为字符串；否则，该值为字符串数组。
   */
  @property()
  public value: string | string[] = '';

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
   * 下拉框底部的帮助文本
   */
  @property()
  public helper!: string;

  /**
   * 验证错误时的错误文本
   */
  @property()
  public error!: string;

  /**
   * 是否可清空下拉框
   */
  @property({ type: Boolean })
  public clearable = false;

  /**
   * 文本是否右对齐
   */
  @property({ type: Boolean, attribute: 'end-aligned', reflect: true })
  public endAligned = false;

  /**
   * 下拉框的前缀文本。仅在聚焦状态，或下拉框有值时才会显示
   */
  @property()
  public prefix!: string;

  /**
   * 下拉框的后缀文本。仅在聚焦状态，或下拉框有值时才会显示
   */
  @property()
  public suffix!: string;

  /**
   * 下拉框的前缀图标
   */
  @property({ attribute: 'prefix-icon' })
  public prefixIcon!: string;

  /**
   * 下拉框的后缀图标
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
   * 该验证为浏览器原生验证 API，基于 `required` 属性的验证结果
   */
  @property({ type: Boolean, reflect: true })
  public invalid = false;

  protected override render(): TemplateResult {
    return html`<mdui-dropdown>
      <mdui-text-field
        slot="trigger"
        class="text-field"
        .variant=${this.variant}
        .name=${this.name}
        .value=${this.value}
        .label=${this.label}
        .placeholder=${this.placeholder}
        .helper=${this.helper}
        .error=${this.error}
        .clearable=${this.clearable}
        .endAligned=${this.endAligned}
        .prefix=${this.prefix}
        .suffix=${this.suffix}
        .prefixIcon=${this.prefixIcon}
        .suffixIcon=${this.suffixIcon}
        .form=${this.form}
        .readonly=${this.readonly}
        .disabled=${this.disabled}
        .required=${this.required}
        .invalid=${this.invalid}
      ></mdui-text-field>
      <mdui-menu>
        <slot></slot>
      </mdui-menu>
    </mdui-dropdown>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-select': Select;
  }
}

import { html, LitElement, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './style.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event input - 选中状态变更时触发
 *
 * @slot - 文本
 *
 * @csspart control - 选择框
 * @csspart label - 文本
 */
@customElement('mdui-checkbox')
export class Checkbox extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @query('input', true)
  protected inputElement!: HTMLInputElement;

  protected get focusProxiedElements(): HTMLElement[] {
    return [this.inputElement];
  }

  protected get focusableDisabled(): boolean {
    return this.disabled;
  }

  protected get rippleDisabled(): boolean {
    return this.disabled;
  }

  /**
   * 是否为禁用状态
   */
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 是否为选中状态
   */
  @property({ type: Boolean, reflect: true })
  public checked = false;

  /**
   * 是否为不确定状态
   */
  @property({ type: Boolean, reflect: true })
  public indeterminate = false;

  /**
   * 提交表单时，是否必须选中该复选框
   */
  @property({ type: Boolean, reflect: true })
  public required = false;

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   */
  @property({ reflect: true })
  public form!: string;

  /**
   * 复选框名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  /**
   * 复选框的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = 'on';

  @watch('indeterminate')
  private async onIndeterminateChange() {
    await this.updateComplete;
    this.inputElement.indeterminate = this.indeterminate;
  }

  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  private onChange() {
    this.checked = this.inputElement.checked;
    emit(this, 'change');
  }

  protected override render(): TemplateResult {
    const { disabled, checked, autofocus } = this;

    return html`<label>
      <input
        type="checkbox"
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
        @change=${this.onChange}
      />
      <i part="control">
        <mdui-ripple></mdui-ripple>
      </i>
      <span part="label"><slot></slot></span>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-checkbox': Checkbox;
  }
}

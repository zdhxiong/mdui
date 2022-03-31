import { html, LitElement, CSSResultGroup, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
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
 * @csspart track - 轨道
 * @csspart handle - 图标
 */
@customElement('mdui-switch')
export class Switch extends RippleMixin(FocusableMixin(LitElement)) {
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
   * 提交表单时，是否必须选中该开关
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
   * 开关的名称，将与表单数据一起提交
   */
  @property({ reflect: true })
  public name!: string;

  /**
   * 开关的值，将于表单数据一起提交
   */
  @property({ reflect: true })
  public value = 'on';

  /**
   * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
   */
  private onChange() {
    this.checked = this.inputElement.checked;
    emit(this, 'change');
  }

  protected override render(): TemplateResult {
    const { disabled, checked, autofocus, name } = this;

    return html`<label>
      <input
        type="checkbox"
        name=${name}
        ?disabled=${disabled}
        ?checked=${checked}
        ?autofocus=${autofocus}
        @change=${this.onChange}
      />
      <i part="track" class="track"></i>
      <i part="handle" class="handle">
        <mdui-ripple></mdui-ripple>
      </i>
    </label>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-switch': Switch;
  }
}

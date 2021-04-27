import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property } from '@mdui/shared/decorators.js';
import { ifDefined, classMap } from '@mdui/shared/directives.js';
import { ButtonBase } from './button-base.js';

const templateSlot = html`<slot name="icon"></slot> <slot></slot>`;

@customElement('mdui-button')
export class MduiButton extends ButtonBase {
  static get styles(): CSSResultGroup {
    return [super.styles];
  }

  /**
   * 是否在页面加载完后自动聚焦到该按钮
   */
  @property({ type: Boolean, reflect: true })
  autofocus = false;

  /**
   * 是否禁用按钮
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * 此 button 元素关联的 form 元素的 id 属性
   */
  @property({ reflect: true })
  form!: string;

  /**
   * button的名称，与表单数据一起提交。
   */
  @property({ reflect: true })
  name!: string;

  /**
   * button的类型。可选值：`submit`, `reset`, `button`, `menu`
   */
  @property({ reflect: true })
  type!: string;

  /**
   * button的初始值，与表单数据一起提交。
   */
  @property({ reflect: true })
  value!: string;

  render(): TemplateResult {
    const { autofocus, disabled, form, name, type, value } = this;

    return html`
      <button
        class="${classMap(this.getButtonClasses())}"
        type="${ifDefined(type)}"
        form="${ifDefined(form)}"
        name="${ifDefined(name)}"
        value="${ifDefined(value)}"
        ?autofocus="${autofocus}"
        ?disabled="${disabled}"
      >
        ${templateSlot}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': MduiButton;
  }
}

import { html, property, customElement } from 'lit-element';
import ifNonNull from '../../directives/if-non-null.js';
import ButtonBase from './button-base.js';

const templateSlot = html`<slot name="icon"></slot> <slot></slot>`;

@customElement('mdui-button')
class MduiButton extends ButtonBase {
  static get styles() {
    return [super.styles!];
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

  render() {
    const { autofocus, disabled, form, name, type, value } = this;

    return html`
      <button
        class="${this.getButtonClasses()}"
        type="${ifNonNull(type)}"
        form="${ifNonNull(form)}"
        name="${ifNonNull(name)}"
        value="${ifNonNull(value)}"
        ?autofocus="${autofocus}"
        ?disabled="${disabled}"
      >
        ${templateSlot}
      </button>
    `;
  }
}

export default MduiButton;

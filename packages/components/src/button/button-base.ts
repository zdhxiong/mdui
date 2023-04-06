import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import cc from 'classcat';
import { FormController } from '@mdui/shared/controllers/form.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../circular-progress.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { buttonBaseStyle } from './button-base-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type RenderButtonOptions = {
  id?: string;
  className?: string;
  part?: string; // csspart 名称
  content?: TemplateResult | TemplateResult[];
  tabindex?: number;
};

export class ButtonBase extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    buttonBaseStyle,
  ];

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
   * 是否为加载中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public loading = false;

  /**
   * 是否在页面加载时自动获得焦点
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public override autofocus = false;

  /**
   * 按钮的名称，将与表单数据一起提交
   *
   * **Note**：仅在未指定 `href` 属性时可用
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 按钮的初始值，将与表单数据一起提交
   *
   * **Note**：仅在未指定 `href` 属性时可用
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 按钮的类型。默认值为 `button`。可选值为：
   * * `submit`：点击按钮将表单数据提交给服务器
   * * `reset`：点击按钮将表单中所有组件重置为初始值
   * * `button`：按钮没有默认行为
   *
   * **Note**：仅在未指定 `href` 属性时可用
   */
  @property({ reflect: true })
  public type:
    | 'submit' /*此按钮将表单数据提交给服务器*/
    | 'reset' /*此按钮重置所有组件为初始值*/
    | 'button' /*此按钮没有默认行为*/ = 'button';

  /**
   * 关联的 `form` 元素。此属性值必须为同一页面中的一个 `<form>` 元素的 `id` 属性。
   *
   * 如果此属性未指定，则元素必须是 `form` 元素的后代。利用此属性，你可以将元素放置在页面中的任何位置，而不仅仅是作为 `form` 元素的后代。
   *
   * **Note**：仅在未指定 `href` 属性时可用
   */
  @property({ reflect: true })
  public form?: string;

  /**
   *
   * 覆盖 `form` 元素的 `action` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
   */
  @property({ reflect: true, attribute: 'formaction' })
  public formAction?: string;

  /**
   * 覆盖 `form` 元素的 `enctype` 属性。可选值为：
   * * `application/x-www-form-urlencoded`：未指定时的默认值
   * * `multipart/form-data`
   * * `text/plain`
   *
   * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
   */
  @property({ reflect: true, attribute: 'formenctype' })
  public formEnctype?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';

  /**
   * 覆盖 `form` 元素的 `method` 属性。可选值为：
   * * `post`
   * * `get`
   *
   * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
   */
  @property({ reflect: true, attribute: 'formmethod' })
  public formMethod?: 'post' | 'get';

  /**
   *
   * 覆盖 `form` 元素的 `novalidate` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'formnovalidate',
  })
  public formNovalidate = false;

  /**
   * 覆盖 `form` 元素的 `target` 属性。可选值为：
   * * `_self`
   * * `_blank`
   * * `_parent`
   * * `_top`
   *
   * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
   */
  @property({ reflect: true, attribute: 'formtarget' })
  public formTarget?: '_self' | '_blank' | '_parent' | '_top';

  private readonly formController: FormController = new FormController(this);

  /**
   * 表单验证状态对象
   */
  public get validity(): ValidityState | undefined {
    if (this.isButton()) {
      return (this.focusElement as HTMLButtonElement).validity;
    }
  }

  /**
   * 表单验证的错误提示信息
   */
  public get validationMessage(): string | undefined {
    if (this.isButton()) {
      return (this.focusElement as HTMLButtonElement).validationMessage;
    }
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected override get focusElement(): HTMLElement | null {
    return this.isButton()
      ? this.renderRoot?.querySelector('._button')
      : this.renderRoot?.querySelector('._a');
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', () => {
      if (this.type === 'submit') {
        this.formController.submit(this);
      }

      if (this.type === 'reset') {
        this.formController.reset(this);
      }
    });
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity() {
    if (this.isButton()) {
      const valid = (this.focusElement as HTMLButtonElement).checkValidity();

      if (!valid) {
        emit(this, 'invalid', {
          bubbles: false,
          cancelable: true,
          composed: false,
        });
      }

      return valid;
    }

    return true;
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`。
   *
   * 验证未通过时，还将在组件上显示未通过的提示。
   */
  public reportValidity() {
    if (this.isButton()) {
      const invalid = !(
        this.focusElement as HTMLButtonElement
      ).reportValidity();

      if (invalid) {
        emit(this, 'invalid', {
          bubbles: false,
          cancelable: true,
          composed: false,
        });

        // todo 考虑是否要支持 preventDefault() 方法，当前 invalid 状态没有样式
      }

      return !invalid;
    }

    return true;
  }

  /**
   * 设置自定义的错误提示文本。只要文本不为空，则表示字段验证未通过
   *
   * @param message 自定义的提示文本
   */
  public setCustomValidity(message: string) {
    if (this.isButton()) {
      (this.focusElement as HTMLButtonElement).setCustomValidity(message);
    }
  }

  protected renderLoading(): TemplateResult {
    return this.loading
      ? html`<mdui-circular-progress part="loading"></mdui-circular-progress>`
      : nothingTemplate;
  }

  protected renderButton({
    id,
    className,
    part,
    content = html`<slot></slot>`,
  }: RenderButtonOptions): TemplateResult {
    return html`<button
      id=${ifDefined(id)}
      class=${cc(['_button', className])}
      part=${ifDefined(part)}
      ?disabled=${this.rippleDisabled || this.focusDisabled}
    >
      ${content}
    </button>`;
  }

  protected isButton(): boolean {
    return !this.href;
  }
}

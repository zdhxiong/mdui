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
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

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
   *
   * * `submit`：点击按钮将表单数据提交给服务器
   * * `reset`：点击按钮将表单中所有组件重置为初始值
   * * `button`：按钮没有默认行为
   *
   * **Note**：仅在未指定 `href` 属性时可用
   */
  @property({ reflect: true })
  public type:
    | /*此按钮将表单数据提交给服务器*/ 'submit'
    | /*此按钮重置所有组件为初始值*/ 'reset'
    | /*此按钮没有默认行为*/ 'button' = 'button';

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
   * 指定提交表单的 URL。
   *
   * 指定了该属性时，将覆盖 `form` 元素的 `action` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 `type="submit"` 时可用。
   */
  @property({ reflect: true, attribute: 'formaction' })
  public formAction?: string;

  /**
   * 指定提交表单到服务器的内容类型。可选值为：
   *
   * * `application/x-www-form-urlencoded`：未指定属性时的默认值
   * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用此值
   * * `text/plain`：出现于 HTML5，用于调试
   *
   * 指定了该属性时，将覆盖 `form` 元素的 `enctype` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 `type="submit"` 时可用
   */
  @property({ reflect: true, attribute: 'formenctype' })
  public formEnctype?:
    | /*未指定属性时的默认值*/ 'application/x-www-form-urlencoded'
    | /*当表单包含 `<input type="file">` 元素时使用此值*/ 'multipart/form-data'
    | /*出现于 HTML5，用于调试*/ 'text/plain';

  /**
   * 指定提交表单使用的 HTTP 方法。可选值为：
   *
   * * `post`：来自表单的数据被包含在表单内容中，被发送到服务器
   * * `get`：来自表单的数据以 `?` 作为分隔符被附加到 form 的 URI 属性中，得到的 URI 被发送到服务器。当表单没有副作用，且仅包含 ASCII 字符时使用这种方法
   *
   * 指定了该属性时，将覆盖 `form` 元素的 `method` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 `type="submit"` 时可用。
   */
  @property({ reflect: true, attribute: 'formmethod' })
  public formMethod?:
    | /*来自表单的数据被包含在表单内容中，被发送到服务器*/ 'post'
    | /*来自表单的数据以 `?` 作为分隔符被附加到 form 的 URI 属性中，得到的 URI 被发送到服务器。当表单没有副作用，且仅包含 ASCII 字符时使用这种方法*/ 'get';

  /**
   * 指定了该属性时，表示当表单被提交时不需要验证。
   *
   * 指定了该属性时，将覆盖 `form` 元素的 `novalidate` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 `type="submit"` 时可用。
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'formnovalidate',
  })
  public formNoValidate = false;

  /**
   * 在何处显示提交表单后接收到的响应。可选值为：
   *
   * * `_self`：默认。在同一框架中打开
   * * `_blank`：在新窗口中打开
   * * `_parent`：在父框架中打开
   * * `_top`：在整个窗口中打开
   *
   * 指定了该属性时，将覆盖 `form` 元素的 `target` 属性。
   *
   * **Note**：仅在未指定 `href` 属性、且 `type="submit"` 时可用
   */
  @property({ reflect: true, attribute: 'formtarget' })
  public formTarget?:
    | /*默认。在同一框架中打开*/ '_self'
    | /*在新窗口中打开*/ '_blank'
    | /*在父框架中打开*/ '_parent'
    | /*在整个窗口中打开*/ '_top';

  private readonly formController = new FormController(this);

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
      : !this.focusDisabled
      ? this.renderRoot?.querySelector('._a')
      : this;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || this.loading;
  }

  /**
   * 检查表单字段是否验证通过。若未通过则返回 `false`，并触发 `invalid` 事件；若验证通过，则返回 `true`
   */
  public checkValidity(): boolean {
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
  public reportValidity(): boolean {
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
  public setCustomValidity(message: string): void {
    if (this.isButton()) {
      (this.focusElement as HTMLButtonElement).setCustomValidity(message);
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.addEventListener('click', () => {
      if (this.type === 'submit') {
        this.formController.submit(this);
      }

      if (this.type === 'reset') {
        this.formController.reset(this);
      }
    });
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

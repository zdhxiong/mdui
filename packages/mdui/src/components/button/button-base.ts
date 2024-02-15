import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import cc from 'classcat';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
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

export class ButtonBase<E> extends AnchorMixin(
  RippleMixin(FocusableMixin(MduiElement)),
)<E> {
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
   * 是否处于加载中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public loading = false;

  /**
   * 按钮的名称，将与表单数据一起提交。
   *
   * **Note**：仅在未设置 `href` 属性时，此属性才有效。
   */
  @property({ reflect: true })
  public name = '';

  /**
   * 按钮的初始值，将与表单数据一起提交。
   *
   * **Note**：仅在未设置 `href` 属性时，此属性才有效。
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 按钮的类型。默认类型为 `button`。可选类型包括：
   *
   * * `submit`：点击按钮会提交表单数据到服务器
   * * `reset`：点击按钮会将表单中的所有字段重置为初始值
   * * `button`：此类型的按钮没有默认行为
   *
   * **Note**：仅在未指定 `href` 属性时，此属性才有效。
   */
  @property({ reflect: true })
  public type:
    | /*此按钮将表单数据提交给服务器*/ 'submit'
    | /*此按钮重置所有组件为初始值*/ 'reset'
    | /*此按钮没有默认行为*/ 'button' = 'button';

  /**
   * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
   *
   * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
   *
   * **Note**：仅在未指定 `href` 属性时，此属性才有效。
   */
  @property({ reflect: true })
  public form?: string;

  /**
   * 指定提交表单的 URL。
   *
   * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
   *
   * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
   */
  @property({ reflect: true, attribute: 'formaction' })
  public formAction?: string;

  /**
   * 指定提交表单到服务器的内容类型。可选值包括：
   *
   * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
   * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
   * * `text/plain`：HTML5 新增，用于调试
   *
   * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
   *
   * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
   */
  @property({ reflect: true, attribute: 'formenctype' })
  public formEnctype?:
    | /*未指定该属性时的默认值*/ 'application/x-www-form-urlencoded'
    | /*当表单包含 `<input type="file">` 元素时使用*/ 'multipart/form-data'
    | /*HTML5 新增，用于调试*/ 'text/plain';

  /**
   * 指定提交表单时使用的 HTTP 方法。可选值包括：
   *
   * * `post`：表单数据包含在表单内容中，发送到服务器
   * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
   *
   * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
   *
   * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
   */
  @property({ reflect: true, attribute: 'formmethod' })
  public formMethod?:
    | /*表单数据包含在表单内容中，发送到服务器*/ 'post'
    | /*表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法*/ 'get';

  /**
   * 如果设置了此属性，表单提交时将不执行表单验证。
   *
   * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
   *
   * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'formnovalidate',
  })
  public formNoValidate = false;

  /**
   * 提交表单后接收到的响应应显示在何处。可选值包括：
   *
   * * `_self`：默认选项，在当前框架中打开
   * * `_blank`：在新窗口中打开
   * * `_parent`：在父框架中打开
   * * `_top`：在整个窗口中打开
   *
   * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
   *
   * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
   */
  @property({ reflect: true, attribute: 'formtarget' })
  public formTarget?:
    | /*默认选项，在当前框架中打开*/ '_self'
    | /*在新窗口中打开*/ '_blank'
    | /*在父框架中打开*/ '_parent'
    | /*在整个窗口中打开*/ '_top';

  private readonly formController = new FormController(this);

  /**
   * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
   */
  public get validity(): ValidityState | undefined {
    if (this.isButton()) {
      return (this.focusElement as HTMLButtonElement).validity;
    }
  }

  /**
   * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
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
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
   */
  public checkValidity(): boolean {
    if (this.isButton()) {
      const valid = (this.focusElement as HTMLButtonElement).checkValidity();

      if (!valid) {
        // @ts-ignore
        this.emit('invalid', {
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
   * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
   *
   * 如果验证未通过，还会在组件上显示验证失败的提示。
   */
  public reportValidity(): boolean {
    if (this.isButton()) {
      const invalid = !(
        this.focusElement as HTMLButtonElement
      ).reportValidity();

      if (invalid) {
        // @ts-ignore
        this.emit('invalid', {
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
   * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
   *
   * @param message 自定义的错误提示文本
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

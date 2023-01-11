import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { TemplateResult } from 'lit';

type RenderButtonOptions = {
  id?: string;
  className?: string;
  part?: string; // csspart 名称
  content?:
    | TemplateResult
    | typeof nothing
    | (TemplateResult | typeof nothing)[];
  tabindex?: number;
};

export declare class ButtonMixinInterface extends LitElement {
  public disabled: boolean;
  public loading: boolean;
  public override autofocus: boolean;
  public name: string;
  public value: string;
  public type: 'submit' | 'reset' | 'button';
  public form?: string;
  public formAction?: string;
  public formEnctype?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  public formMethod?: 'post' | 'get';
  public formNovalidate: boolean;
  public formTarget?: '_self' | '_blank' | '_parent' | '_top';
  protected renderButton(options: RenderButtonOptions): TemplateResult;
}

export const ButtonMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<ButtonMixinInterface> & T => {
  class ButtonMixinClass extends superclass {
    /**
     * 是否禁用
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean =>
        value !== null && value !== 'false',
    })
    public disabled = false;

    /**
     * 是否为加载中状态
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean =>
        value !== null && value !== 'false',
    })
    public loading = false;

    /**
     * 是否在页面加载时自动获得焦点
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean =>
        value !== null && value !== 'false',
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
    public form!: string;

    /**
     *
     * 覆盖 `form` 元素的 `action` 属性。
     *
     * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
     */
    @property({ reflect: true, attribute: 'formaction' })
    public formAction!: string;

    /**
     * 覆盖 `form` 元素的 `enctype` 属性。可选值为：
     * * `application/x-www-form-urlencoded`：未指定时的默认值
     * * `multipart/form-data`
     * * `text/plain`
     *
     * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
     */
    @property({ reflect: true, attribute: 'formenctype' })
    public formEnctype!:
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
    public formMethod!: 'post' | 'get';

    /**
     *
     * 覆盖 `form` 元素的 `novalidate` 属性。
     *
     * **Note**：仅在未指定 `href` 属性、且 type="submit" 时可用
     */
    @property({
      type: Boolean,
      reflect: true,
      converter: (value: string | null): boolean =>
        value !== null && value !== 'false',
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
    public formTarget!: '_self' | '_blank' | '_parent' | '_top';

    protected renderButton({
      id,
      className,
      part,
      content = html`<slot></slot>`,
    }: RenderButtonOptions): TemplateResult {
      return html`<button
        id=${ifDefined(id)}
        class="_button ${className ? className : ''}"
        part=${ifDefined(part)}
        ?disabled=${this.disabled || this.loading}
      >
        ${content}
      </button>`;
    }
  }

  // @ts-ignore
  return ButtonMixinClass;
};

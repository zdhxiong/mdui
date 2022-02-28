import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';

type RenderButtonOptions = {
  id?: string;
  className?: string;
  content?: TemplateResult | TemplateResult[];
  tabindex?: number;
};

export interface ButtonInterface {
  disabled?: boolean;
  autofocus?: boolean;
  name?: string;
  value?: string;
  type?: 'submit' | 'reset' | 'button';
  form?: string;
  formAction?: string;
  formEnctype?:
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  formMethod?: 'post' | 'get';
  formNovalidate?: boolean;
  formTarget?: '_self' | '_blank' | '_parent' | '_top';
  renderButton(options: RenderButtonOptions): TemplateResult;
}

export const ButtonMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<ButtonInterface> => {
    class Mixin extends superclass {
      @property({ type: Boolean, reflect: true })
      public disabled = false;

      @property({ type: Boolean, reflect: true })
      public autofocus = false;

      @property({ reflect: true })
      public name!: string;

      @property({ reflect: true })
      public value!: string;

      /**
       * 按钮默认改为 button，和原生 button 元素不一样
       */
      @property({ reflect: true })
      public type: 'submit' | 'reset' | 'button' = 'button';

      @property({ reflect: true })
      public form!: string;

      @property({ reflect: true })
      public formAction!: string;

      @property({ reflect: true })
      public formEnctype!:
        | 'application/x-www-form-urlencoded'
        | 'multipart/form-data'
        | 'text/plain';

      @property({ reflect: true })
      public formMethod!: 'post' | 'get';

      @property({ type: Boolean, reflect: true })
      public formNovalidate = false;

      @property({ reflect: true })
      public formTarget!: '_self' | '_blank' | '_parent' | '_top';

      public renderButton({
        id,
        className,
        tabindex,
        content = html`<slot></slot>`,
      }: RenderButtonOptions): TemplateResult {
        const {
          disabled,
          autofocus,
          name,
          value,
          type,
          form,
          formAction,
          formEnctype,
          formMethod,
          formNovalidate,
          formTarget,
        } = this;
        return html`<button
          id=${ifDefined(id)}
          class=${ifDefined(className)}
          tabindex=${ifDefined(tabindex)}
          ?disabled=${disabled}
          ?autofocus=${autofocus}
          name=${ifDefined(name)}
          value=${ifDefined(value)}
          type=${ifDefined(type)}
          form=${ifDefined(form)}
          formaction=${ifDefined(formAction)}
          formenctype=${ifDefined(formEnctype)}
          formmethod=${ifDefined(formMethod)}
          formtarget=${ifDefined(formTarget)}
          ?formnovalidate=${formNovalidate}
        >
          ${content}
        </button>`;
      }
    }

    return Mixin;
  },
);

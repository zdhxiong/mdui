import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import '../icon.js';

@customElement('mdui-button')
export class Button extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  variant = 'text';

  @property({ type: Boolean, reflect: true })
  fullwidth = false;

  @property({ reflect: true })
  icon!: string;

  @property({ reflect: true })
  iconVariant!: string;

  @property({ type: Boolean, reflect: true })
  trailingIcon = false;

  protected renderLabel(): TemplateResult {
    return html`<span class="label"><slot></slot></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`${when(!this.trailingIcon, () => this.renderIcon())}`;
  }

  protected renderTrailingIcon(): TemplateResult {
    return html`${when(this.trailingIcon, () => this.renderIcon())}`;
  }

  protected renderIcon(): TemplateResult {
    return when(
      this.icon,
      () =>
        html`<mdui-icon
          class="icon"
          name=${this.icon}
          variant=${ifDefined(this.iconVariant)}
        ></mdui-icon>`,
      () => html`<slot name="icon"></slot>`,
    );
  }

  protected renderInner(): TemplateResult {
    return html`${this.renderLeadingIcon()}${this.renderLabel()}${this.renderTrailingIcon()}`;
  }

  protected override render(): TemplateResult {
    const {
      disabled,
      href,
      download,
      target,
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

    return html`<mdui-ripple></mdui-ripple>${when(
        this.href,
        () =>
          html`${when(
            disabled,
            () => html`<span class="button">${this.renderInner()}</span>`,
            () => html`<a
              class="button"
              href=${href}
              download=${ifDefined(download)}
              target=${ifDefined(target)}
            >
              ${this.renderInner()}
            </a>`,
          )}`,
        () => html`<button
          class="button"
          name=${ifDefined(name)}
          value=${ifDefined(value)}
          type=${ifDefined(type)}
          form=${ifDefined(form)}
          formaction=${ifDefined(formAction)}
          formenctype=${ifDefined(formEnctype)}
          formmethod=${ifDefined(formMethod)}
          formtarget=${ifDefined(formTarget)}
          ?formnovalidate=${formNovalidate}
          ?autofocus=${autofocus}
          ?disabled=${disabled}
        >
          ${this.renderInner()}
        </button>`,
      )} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': Button;
  }
}

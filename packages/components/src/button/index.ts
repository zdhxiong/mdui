import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';

const templateSlot = html`<slot name="icon"></slot> <slot></slot>`;

@customElement('mdui-button')
export class MduiButton extends ButtonBase {
  static override styles: CSSResultGroup = style;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ reflect: true })
  variant!: string;

  @property({ type: Boolean, reflect: true })
  fullwidth = false;

  @property({ reflect: true })
  icon!: string;

  @property({ type: Boolean, reflect: true })
  trailingIcon = false;

  render(): TemplateResult {
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

    return html`${when(
      this.href,
      () =>
        html`${when(
          disabled,
          () => html`<span>${templateSlot}</span>`,
          () => html`<a
            href=${href}
            download=${ifDefined(download)}
            target=${ifDefined(target)}
          >
            ${templateSlot}
          </a>`,
        )}`,
      () => html`<button
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
        ${templateSlot}
      </button>`,
    )} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': MduiButton;
  }
}

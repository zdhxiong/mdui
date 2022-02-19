import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { when } from 'lit/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ButtonBase } from '../button/button-base.js';
import { style } from './style.js';
import '../icon.js';

@customElement('mdui-fab')
export class Fab extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ reflect: true })
  public variant: 'primary' | 'surface' | 'secondary' | 'tertiary' = 'primary';

  @property({ reflect: true })
  public size: 'normal' | 'small' | 'large' = 'normal';

  @property({ reflect: true })
  public icon!: string;

  @property({ reflect: true })
  public iconVariant!: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';

  @property({ reflect: true })
  public tooltip!: string;

  protected renderLabel(): TemplateResult {
    return html`<span class="label"><slot></slot></span>`;
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
    return html`${this.renderIcon()}${this.renderLabel()}`;
  }

  protected override render(): TemplateResult {
    const {
      disabled,
      href,
      download,
      target,
      rel,
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
              rel=${ifDefined(rel)}
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
    'mdui-fab': Fab;
  }
}

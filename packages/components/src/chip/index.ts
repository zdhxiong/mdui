import { customElement } from 'lit/decorators/custom-element.js';
import { CSSResultGroup, html, nothing, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ButtonBase } from '../button/button-base.js';
import { style } from './style.js';
import '../icon.js';
import '@mdui/icons/check.js';
import '@mdui/icons/clear.js';

@customElement('mdui-chip')
export class Chip extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ reflect: true })
  public variant: 'assist' | 'filter' | 'input' | 'suggestion' = 'assist';

  @property({ type: Boolean, reflect: true })
  public elevated = false;

  @property({ type: Boolean, reflect: true })
  public selectable = false;

  @property({ type: Boolean, reflect: true })
  public selected = false;

  @property({ type: Boolean, reflect: true })
  public deletable = false;

  @property({ reflect: true })
  public icon!: string;

  @property({ reflect: true })
  public iconVariant!: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';

  @property({ reflect: true })
  public avatar!: string;

  protected renderLabel(): TemplateResult {
    return html`<span class="label"><slot></slot></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    if (this.selected && ['assist', 'filter'].includes(this.variant)) {
      return html`<mdui-icon-check class="icon"></mdui-icon-check>`;
    }

    if (this.icon) {
      return html`<mdui-icon
        class="icon"
        name=${this.icon}
        variant=${ifDefined(this.iconVariant)}
      ></mdui-icon>`;
    }

    if (this.avatar) {
      return html`<span
        class="avatar"
        style=${styleMap({ backgroundImage: `url(${this.avatar})` })}
      ></span>`;
    }

    return html`<slot name="icon"></slot>`;
  }

  protected renderTrailingIcon(): TemplateResult | typeof nothing {
    if (this.deletable) {
      return html`<span class="delete">
        <mdui-icon-clear></mdui-icon-clear>
      </span>`;
    }

    return nothing;
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
            () => html`<span class="button chip">${this.renderInner()}</span>`,
            () => html`<a
              class="button chip"
              href=${href}
              download=${ifDefined(download)}
              target=${ifDefined(target)}
              rel=${ifDefined(rel)}
            >
              ${this.renderInner()}
            </a>`,
          )}`,
        () => html`<button
          class="button chip"
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
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}

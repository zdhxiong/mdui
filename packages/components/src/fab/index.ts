import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
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
    return this.icon
      ? html`<mdui-icon
          class="icon"
          name=${this.icon}
          variant=${ifDefined(this.iconVariant)}
        ></mdui-icon>`
      : html`<slot name="icon"></slot>`;
  }

  protected renderInner(): TemplateResult[] {
    return [this.renderIcon(), this.renderLabel()];
  }

  protected override render(): TemplateResult {
    const { disabled, href } = this;

    return html`<mdui-ripple></mdui-ripple>${href
        ? disabled
          ? html`<span class="button">${this.renderInner()}</span>`
          : this.renderAnchor({
              className: 'button',
              content: this.renderInner(),
            })
        : this.renderButton({
            className: 'button',
            content: this.renderInner(),
          })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-fab': Fab;
  }
}

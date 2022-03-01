import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { when } from 'lit/directives/when.js';
import type { MaterialIconsName } from '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import '../icon.js';

@customElement('mdui-button')
export class Button extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @queryAll('.button')
  protected focusProxiedElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ reflect: true })
  public variant:
    | 'elevated'
    | 'filled'
    | 'tonal'
    | 'outlined'
    | 'text'
    | 'icon' = 'text';

  @property({ type: Boolean, reflect: true })
  public fullwidth = false;

  @property({ reflect: true })
  public icon!: MaterialIconsName;

  @property({ type: Boolean, reflect: true })
  public trailingIcon = false;

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
    return this.icon
      ? html`<mdui-icon class="icon" name=${this.icon}></mdui-icon>`
      : html`<slot name="icon"></slot>`;
  }

  protected renderInner(): TemplateResult[] {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon(),
    ];
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
    'mdui-button': Button;
  }
}

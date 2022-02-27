import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
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
  public icon!: MaterialIconsName;

  @property({ reflect: true })
  public tooltip!: string;

  protected renderLabel(): TemplateResult {
    return html`<span class="label"><slot></slot></span>`;
  }

  protected renderIcon(): TemplateResult {
    return this.icon
      ? html`<mdui-icon class="icon" name=${this.icon}></mdui-icon>`
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

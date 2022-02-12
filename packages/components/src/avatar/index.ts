import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { style } from './style.js';
import '../icon.js';

@customElement('mdui-avatar')
export class Avatar extends LitElement {
  static override styles: CSSResultGroup = style;

  @property({ reflect: true })
  public alt!: string;

  @property({ reflect: true })
  public src!: string;

  @property({ reflect: true })
  public icon!: string;

  @property({ reflect: true })
  public iconVariant!: string;

  /**
   * square, circular, rounded
   */
  @property({ reflect: true })
  public variant = 'circular';

  /**
   * contain, cover, fill, none, scale-down
   */
  @property({ reflect: true })
  public fit!: string;

  protected override render(): TemplateResult {
    const { alt, src, icon, iconVariant, fit } = this;

    if (src) {
      return html`<img
        alt=${ifDefined(alt)}
        src=${src}
        style=${styleMap({ objectFit: fit })}
      />`;
    }

    if (icon) {
      return html`<mdui-icon
        name=${icon}
        variant=${ifDefined(iconVariant)}
      ></mdui-icon>`;
    }

    return html`<slot></slot>`;
  }
}

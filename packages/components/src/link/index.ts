import { html, TemplateResult } from 'lit';
import { customElement, property } from '@mdui/shared/decorators.js';
import { ifDefined } from '@mdui/shared/directives.js';
import { ButtonBase } from '../button/button-base.js';

const templateSlot = html`<slot name="icon"></slot> <slot></slot>`;

@customElement('mdui-link')
export class MduiLink extends ButtonBase {
  @property({ reflect: true })
  download!: string;

  @property({ reflect: true })
  href = '';

  @property({ reflect: true })
  hreflang!: string;

  @property({ reflect: true })
  rel!: string;

  @property({ reflect: true })
  target!: string;

  @property({ reflect: true })
  type!: string;

  render(): TemplateResult {
    const { download, href, hreflang, rel, target, type } = this;

    return html`<a
      class="${this.getButtonClasses()}"
      href="${href}"
      download="${ifDefined(download)}"
      hreflang="${ifDefined(hreflang)}"
      rel="${ifDefined(rel)}"
      target="${ifDefined(target)}"
      type="${ifDefined(type)}"
      >${templateSlot}</a
    >`;
  }
}

import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property';
import { ifDefined } from 'lit/directives/if-defined.js';

type RenderAnchorOptions = {
  id?: string;
  className?: string;
  content?: TemplateResult | TemplateResult[];
  tabindex?: number;
};

export interface AnchorInterface {
  href?: string;
  download?: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
  rel?: string;
  renderAnchor(options: RenderAnchorOptions): TemplateResult;
}

export const AnchorMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<AnchorInterface> => {
    class Mixin extends superclass {
      @property({ reflect: true })
      public href!: string;

      @property({ reflect: true })
      public download!: string;

      @property({ reflect: true })
      public target!: '_blank' | '_parent' | '_self' | '_top';

      @property({ reflect: true })
      public rel!: string;

      public renderAnchor({
        id,
        className,
        tabindex,
        content = html`<slot></slot>`,
      }: RenderAnchorOptions): TemplateResult {
        const { href, download, target, rel } = this;

        return html`<a
          id=${ifDefined(id)}
          class=${ifDefined(className)}
          tabindex=${ifDefined(tabindex)}
          href=${ifDefined(href)}
          download=${ifDefined(download)}
          target=${ifDefined(target)}
          rel=${ifDefined(rel)}
        >
          ${content}
        </a>`;
      }
    }

    return Mixin;
  },
);

import { Constructor } from '@open-wc/dedupe-mixin';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';

type RenderAnchorOptions = {
  id?: string;
  className?: string;
  content?: TemplateResult | TemplateResult[];
  tabindex?: number;
};

export interface AnchorMixinInterface {
  href?: string;
  download?: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
  rel?: string;
}

export const AnchorMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<AnchorMixinInterface> => {
  class AnchorMixinClass extends superclass {
    /**
     * 链接指向的页面的 URL。
     *
     * 若指定了该属性，则组件内部会渲染为 `<a>` 元素，并可以使用链接相关的属性
     */
    @property({ reflect: true })
    public href!: string;

    /**
     * 被下载的超链接目标。
     *
     * **Note**：仅在指定了 `href` 属性时可用
     */
    @property({ reflect: true })
    public download!: string;

    /**
     * 在何处打卡链接。可选值为：
     * * `_blank`
     * * `_parent`
     * * `_self`
     * * `_top`
     *
     * **Note**：仅在指定了 `href` 属性时可用
     */
    @property({ reflect: true })
    public target!: '_blank' | '_parent' | '_self' | '_top';

    /**
     * 当前文档与被链接文档之间的关系。
     *
     * **Note**：仅在指定了 `href` 属性时可用
     */
    @property({ reflect: true })
    public rel!: string;

    protected renderAnchor({
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

  return AnchorMixinClass;
};

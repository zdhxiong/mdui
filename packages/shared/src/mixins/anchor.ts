import { html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { TemplateResult } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import type { RefDirective } from 'lit/directives/ref.js';

type RenderAnchorOptions = {
  id?: string;
  className?: string;
  part?: string; // csspart 名称
  content?:
    | TemplateResult
    | typeof nothing
    | (TemplateResult | typeof nothing)[];
  tabindex?: number;
  refDirective?: DirectiveResult<typeof RefDirective>;
};

export declare class AnchorMixinInterface extends LitElement {
  public href?: string;
  public download?: string;
  public target?: '_blank' | '_parent' | '_self' | '_top';
  public rel?: string;
  protected renderAnchor(options: RenderAnchorOptions): TemplateResult;
}

export const AnchorMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<AnchorMixinInterface> & T => {
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
      part,
      content = html`<slot></slot>`,
      refDirective,
    }: RenderAnchorOptions): TemplateResult {
      return html`<a
        ${refDirective}
        id=${ifDefined(id)}
        class="_a ${className ? className : ''}"
        part=${ifDefined(part)}
        href=${ifDefined(this.href)}
        download=${ifDefined(this.download)}
        target=${ifDefined(this.target)}
        rel=${ifDefined(this.rel)}
      >
        ${content}
      </a>`;
    }
  }

  // @ts-ignore
  return AnchorMixinClass;
};

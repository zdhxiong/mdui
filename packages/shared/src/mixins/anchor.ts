import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { LitElement, TemplateResult } from 'lit';
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
  tabIndex?: number;
  refDirective?: DirectiveResult<typeof RefDirective>;
};

export declare class AnchorMixinInterface {
  public href?: string;
  public download?: string;
  public target?: '_blank' | '_parent' | '_self' | '_top';
  public rel?:
    | 'alternate'
    | 'author'
    | 'bookmark'
    | 'external'
    | 'help'
    | 'license'
    | 'me'
    | 'next'
    | 'nofollow'
    | 'noreferrer'
    | 'opener'
    | 'prev'
    | 'search'
    | 'tag';
  protected renderAnchor(options: RenderAnchorOptions): TemplateResult;
}

export const AnchorMixin = <T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<AnchorMixinInterface> & T => {
  class AnchorMixinClass extends superclass {
    /**
     * 链接的目标 URL。
     *
     * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
     */
    @property({ reflect: true })
    public href!: string;

    /**
     * 下载链接的目标。
     *
     * **Note**：仅在设置了 `href` 属性时，此属性才有效。
     */
    @property({ reflect: true })
    public download!: string;

    /**
     * 链接的打开方式。可选值包括：
     *
     * * `_blank`：在新窗口中打开链接
     * * `_parent`：在父框架中打开链接
     * * `_self`：默认。在当前框架中打开链接
     * * `_top`：在整个窗口中打开链接
     *
     * **Note**：仅在设置了 `href` 属性时，此属性才有效。
     */
    @property({ reflect: true })
    public target!:
      | /*在新窗口中打开链接*/ '_blank'
      | /*在父框架中打开链接*/ '_parent'
      | /*默认。在当前框架中打开链接*/ '_self'
      | /*在整个窗口中打开链接*/ '_top';

    /**
     * 当前文档与被链接文档之间的关系。可选值包括：
     *
     * * `alternate`：当前文档的替代版本
     * * `author`：当前文档或文章的作者
     * * `bookmark`：永久链接到最近的祖先章节
     * * `external`：引用的文档与当前文档不在同一站点
     * * `help`：链接到相关的帮助文档
     * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
     * * `me`：当前文档代表链接内容的所有者
     * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
     * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
     * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
     * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
     * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
     * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
     * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
     *
     * **Note**：仅在指定了 `href` 属性时可用。
     */
    @property({ reflect: true })
    public rel!:
      | /*当前文档的替代版本*/ 'alternate'
      | /*当前文档或文章的作者*/ 'author'
      | /*永久链接到最近的祖先章节*/ 'bookmark'
      | /*引用的文档与当前文档不在同一站点*/ 'external'
      | /*链接到相关的帮助文档*/ 'help'
      | /*当前文档的主要内容由被引用文件的版权许可覆盖*/ 'license'
      | /*当前文档代表链接内容的所有者*/ 'me'
      | /*当前文档是系列中的一部分，被引用的文档是系列的下一个文档*/ 'next'
      | /*当前文档的作者或发布者不认可被引用的文件*/ 'nofollow'
      | /*不包含 `Referer` 头。类似于 `noopener` 的效果*/ 'noreferrer'
      | /*如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文*/ 'opener'
      | /*当前文档是系列的一部分，被引用的文档是系列的上一个文档*/ 'prev'
      | /*提供一个资源链接，可用于搜索当前文件及其相关页面*/ 'search'
      | /*提供一个适用于当前文档的标签（由给定地址识别）*/ 'tag';

    protected renderAnchor({
      id,
      className,
      part,
      content = html`<slot></slot>`,
      refDirective,
      tabIndex,
    }: RenderAnchorOptions): TemplateResult {
      return html`<a
        ${refDirective!}
        id=${ifDefined(id)}
        class="_a ${className ? className : ''}"
        part=${ifDefined(part)}
        href=${ifDefined(this.href)}
        download=${ifDefined(this.download)}
        target=${ifDefined(this.target)}
        rel=${ifDefined(this.rel)}
        tabindex=${ifDefined(tabIndex)}
      >
        ${content}
      </a>`;
    }
  }

  return AnchorMixinClass as unknown as Constructor<AnchorMixinInterface> & T;
};

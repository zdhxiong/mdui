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

export declare class AnchorMixinInterface extends LitElement {
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
     * 在何处打开链接。可选值为：
     *
     * * `_blank`：在新窗口中打开链接
     * * `_parent`：在父框架中打开链接
     * * `_self`：默认。在相同的框架中打开链接
     * * `_top`：在整个窗口中打开链接
     *
     * **Note**：仅在指定了 `href` 属性时可用
     */
    @property({ reflect: true })
    public target!:
      | /*在新窗口中打开链接*/ '_blank'
      | /*在父框架中打开链接*/ '_parent'
      | /*默认。在相同的框架中打开链接*/ '_self'
      | /*在整个窗口中打开链接*/ '_top';

    /**
     * 当前文档与被链接文档之间的关系。可选值为：
     *
     * * `alternate`：当前文档的替代描述
     * * `author`：当前文档或文章的作者
     * * `bookmark`：到最近祖先章节的永久链接
     * * `external`：引用的文档与当前的文档不属于同一个站点
     * * `help`：链接到上下文相关的帮助
     * * `license`：表示当前文档的主要内容由被引用文件描述的版权许可所涵盖
     * * `me`：表示当前文档代表拥有链接内容的人
     * * `next`：表示当前文档是一个系列的一部分，被引用的文档是该系列中的下一个文档
     * * `nofollow`：表示当前文档的原作者或出版商不认可被引用的文件
     * * `noreferrer`：不会包含 `Referer` 标头。和 `noopener` 效果类似
     * * `opener`：如果超链接会创建一个非辅助浏览上下文的顶级浏览上下文（即以 `_blank` 作为 `target` 属性值），则创建一个辅助浏览上下文
     * * `prev`：表示当前文档是系列的一部分，被引用的文档是该系列中的上一个文档
     * * `search`：给出一个资源的链接，可以用来搜索当前文件及其相关页面
     * * `tag`：给出一个适用于当前文档的标签（由给定地址识别）
     *
     * **Note**：仅在指定了 `href` 属性时可用
     */
    @property({ reflect: true })
    public rel!:
      | /*当前文档的替代描述*/ 'alternate'
      | /*当前文档或文章的作者*/ 'author'
      | /*到最近祖先章节的永久链接*/ 'bookmark'
      | /*引用的文档与当前的文档不属于同一个站点*/ 'external'
      | /*链接到上下文相关的帮助*/ 'help'
      | /*表示当前文档的主要内容由被引用文件描述的版权许可所涵盖*/ 'license'
      | /*表示当前文档代表拥有链接内容的人*/ 'me'
      | /*表示当前文档是一个系列的一部分，被引用的文档是该系列中的下一个文档*/ 'next'
      | /*表示当前文档的原作者或出版商不认可被引用的文件*/ 'nofollow'
      | /*不会包含 `Referer` 标头。和 `noopener` 效果类似*/ 'noreferrer'
      | /*如果超链接会创建一个非辅助浏览上下文的顶级浏览上下文（即以 `_blank` 作为 `target` 属性值），则创建一个辅助浏览上下文*/ 'opener'
      | /*表示当前文档是系列的一部分，被引用的文档是该系列中的上一个文档*/ 'prev'
      | /*给出一个资源的链接，可以用来搜索当前文件及其相关页面*/ 'search'
      | /*给出一个适用于当前文档的标签（由给定地址识别）*/ 'tag';

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

  // @ts-ignore
  return AnchorMixinClass;
};

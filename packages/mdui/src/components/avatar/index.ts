import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import '../icon.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @summary 头像组件
 *
 * ```html
 * <mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
 * ```
 *
 * @slot - 自定义头像中的内容，可以为字母、汉字、`<img>` 元素、图标等
 *
 * @csspart image - 使用图片头像时，组件内部的 `<img>` 元素
 * @csspart icon - 使用图标头像时，组件内部的 `<mdui-icon>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-avatar')
export class Avatar extends MduiElement<AvatarEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 头像的图片地址
   */
  @property({ reflect: true })
  public src?: string;

  /**
   * 图片如何适应容器框，同原生的 [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。可选值为：
   *
   * * `contain`：保持原有尺寸比例。内容被缩放
   * * `cover`：保持原有尺寸比例。但部分内容可能被剪切
   * * `fill`：默认，不保证保持原有的比例，内容拉伸填充整个内容容器
   * * `none`：保留原有元素内容的长度和宽度，也就是说内容不会被重置
   * * `scale-down`：保持原有尺寸比例。内容的尺寸与 `none` 或 `contain` 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些
   */
  @property({ reflect: true })
  public fit?:
    | /*保持原有尺寸比例。内容被缩放*/ 'contain'
    | /*保持原有尺寸比例。但部分内容可能被剪切*/ 'cover'
    | /*默认，不保证保持原有的比例，内容拉伸填充整个内容容器*/ 'fill'
    | /*保留原有元素内容的长度和宽度，也就是说内容不会被重置*/ 'none'
    | /*保持原有尺寸比例。内容的尺寸与 `none` 或 `contain` 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些*/ 'scale-down';

  /**
   * 头像的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 描述头像的替换文本
   */
  @property({ reflect: true })
  public label?: string;

  private readonly hasSlotController = new HasSlotController(this, '[default]');

  protected override render(): TemplateResult {
    return this.hasSlotController.test('[default]')
      ? html`<slot></slot>`
      : this.src
      ? html`<img
          part="image"
          alt=${ifDefined(this.label)}
          src=${this.src}
          style=${styleMap({ objectFit: this.fit })}
        />`
      : this.icon
      ? html`<mdui-icon part="icon" name=${this.icon}></mdui-icon>`
      : nothingTemplate;
  }
}

export interface AvatarEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-avatar': Avatar;
  }
}

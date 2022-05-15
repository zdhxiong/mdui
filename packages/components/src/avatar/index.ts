import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @summary 头像组件
 *
 * @event click - 点击时触发
 *
 * @slot - 自定义头像中的内容，可以为字母、汉字、`<img>` 元素、图标等
 *
 * @csspart image - 图片
 * @csspart icon - 图标
 */
@customElement('mdui-avatar')
export class Avatar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 头像的图片地址
   */
  @property({ reflect: true })
  public src!: string;

  /**
   * 图片如何适应容器框，同原生的 object-fit。可选值为：
   *
   * * `contain`：保持原有尺寸比例。内容被缩放
   * * `cover`：保持原有尺寸比例。但部分内容可能被剪切
   * * `fill`：默认，不保证保持原有的比例，内容拉伸填充整个内容容器
   * * `none`：保留原有元素内容的长度和宽度，也就是说内容不会被重置
   * * `scale-down`：保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些
   */
  @property({ reflect: true })
  public fit!: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * 头像的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 描述头像的替换文本
   */
  @property({ reflect: true })
  public label!: string;

  protected override render(): TemplateResult {
    const { label, src, icon, fit } = this;

    if (src) {
      return html`<img
        part="image"
        alt=${ifDefined(label)}
        src=${src}
        style=${styleMap({ objectFit: fit })}
      />`;
    }

    if (icon) {
      return html`<mdui-icon part="icon" name=${icon}></mdui-icon>`;
    }

    return html`<slot></slot>`;
  }
}

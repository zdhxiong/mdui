import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @summary 头像组件
 *
 * @slot - 自定义头像中的内容，可以为字母、汉字、`<img> 元素`、图标等
 */
@customElement('mdui-avatar')
export class Avatar extends LitElement {
  static override styles: CSSResultGroup = style;

  /**
   * 图片头像图片的 alt
   */
  @property({ reflect: true })
  public alt!: string;

  /**
   * 图片头像的图片地址
   */
  @property({ reflect: true })
  public src!: string;

  /**
   * 图标头像的图标名称
   */
  @property({ reflect: true })
  public icon!: string;

  /**
   * 图标头像的图标变体
   */
  @property({ reflect: true })
  public iconVariant!: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';

  /**
   * 头像形状。可选值为：
   *
   * * `square`：正方形
   * * `circular`：圆形
   * * `rounded`：带圆角的正方形
   */
  @property({ reflect: true })
  public variant:
    | 'square' /*正方形*/
    | 'circular' /*圆形*/
    | 'rounded' /*带圆角的正方形*/ = 'circular';

  /**
   * 图片如何适应容器框，同原生的 object-fit。可选值为：
   *
   * `contain`：
   * `cover`：
   * `fill`：
   * `none`：
   * `scale-down`：
   */
  @property({ reflect: true })
  public fit!: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

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

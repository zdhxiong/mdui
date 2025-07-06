import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AccessibleMixin } from '@mdui/shared/mixins/accessible.js';
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
 * @slot - 自定义头像内容，可以为字母、汉字、`<img>` 元素、图标等
 *
 * @csspart image - 使用图片作为头像时，组件内部的 `<img>` 元素
 * @csspart icon - 使用图标作为头像时，组件内部的 `<mdui-icon>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-avatar')
export class Avatar extends AccessibleMixin(MduiElement)<AvatarEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 头像图片的 URL 地址
   */
  @property({ reflect: true })
  public src?: string;

  /**
   * 图片如何适应容器框，与原生的 [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 属性相同。可选值包括：
   *
   * * `contain`：保持图片原有尺寸比例，内容会被等比例缩放
   * * `cover`：保持图片原有尺寸比例，但部分内容可能被剪切
   * * `fill`：默认值，不保持图片原有尺寸比例，内容会被拉伸以填充整个容器
   * * `none`：保留图片原有尺寸，内容不会被缩放或拉伸
   * * `scale-down`：保持图片原有尺寸比例，内容尺寸与 `none` 或 `contain` 中较小的一个相同
   */
  @property({ reflect: true })
  public fit?:
    | /*保持图片原有尺寸比例，内容会被等比例缩放*/ 'contain'
    | /*保持图片原有尺寸比例，但部分内容可能被剪切*/ 'cover'
    | /*默认值，不保持图片原有尺寸比例，内容会被拉伸以填充整个容器*/ 'fill'
    | /*保留图片原有尺寸，内容不会被缩放或拉伸*/ 'none'
    | /*保持图片原有尺寸比例，内容尺寸与 `none` 或 `contain` 中较小的一个相同*/ 'scale-down';

  /**
   * 头像的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: string;

  private readonly hasSlotController = new HasSlotController(this, '[default]');

  protected override render(): TemplateResult {
    return html`<div
        class="base"
        role="img"
        aria-label=${ifDefined(this._accessibleLabel)}
        aria-describedby=${ifDefined(
          this._accessibleDescription ? 'describedby' : undefined,
        )}
      >
        ${this.hasSlotController.test('[default]')
          ? html`<slot aria-hidden="true"></slot>`
          : this.src
            ? html`<img
                part="image"
                alt=""
                src=${this.src}
                style=${styleMap({ objectFit: this.fit })}
              />`
            : this.icon
              ? html`<mdui-icon
                  part="icon"
                  name=${this.icon}
                  aria-hidden="true"
                ></mdui-icon>`
              : nothingTemplate}
      </div>
      ${when(
        this._accessibleDescription,
        () =>
          html`<div style="display: none" id="describedby">
            ${this._accessibleDescription}
          </div>`,
      )}`;
  }
}

export interface AvatarEventMap {}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-avatar': Avatar;
  }
}

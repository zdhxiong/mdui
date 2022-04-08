import { customElement } from 'lit/decorators/custom-element.js';
import { CSSResultGroup, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';
import '@mdui/icons/check.js';
import '@mdui/icons/clear.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart label - 文本
 * @csspart check - 选中状态图标
 * @csspart icon - 图标
 * @csspart avatar - 头像
 * @csspart delete - 删除图标
 * @csspart loading - 加载中动画
 */
@customElement('mdui-chip')
export class Chip extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @query('.button')
  protected focusProxiedElement!: HTMLElement;

  /**
   * 纸片形状。可选值为：
   * * `assist`
   * * `filter`
   * * `input`
   * * `suggestion`
   */
  @property({ reflect: true })
  public variant:
    | 'assist' /*预览图*/
    | 'filter' /*预览图*/
    | 'input' /*预览图*/
    | 'suggestion' = 'assist';

  /**
   * 是否包含阴影
   */
  @property({ type: Boolean, reflect: true })
  public elevated = false;

  /**
   * 是否可选中
   */
  @property({ type: Boolean, reflect: true })
  public selectable = false;

  /**
   * 是否为选中状态
   */
  @property({ type: Boolean, reflect: true })
  public selected = false;

  /**
   * 是否可删除。为 `true` 时，在右侧会显示删除图标
   */
  @property({ type: Boolean, reflect: true })
  public deletable = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 左侧的头像链接
   */
  @property({ reflect: true })
  public avatar!: string;

  protected renderLeadingIcon(): TemplateResult {
    if (this.selected && ['assist', 'filter'].includes(this.variant)) {
      return html`<mdui-icon-check
        part="check"
        class="icon"
      ></mdui-icon-check>`;
    }

    if (this.icon) {
      return html`<mdui-icon
        part="icon"
        class="icon"
        name=${this.icon}
      ></mdui-icon>`;
    }

    if (this.avatar) {
      return html`<span
        part="avatar"
        class="avatar"
        style=${styleMap({ backgroundImage: `url(${this.avatar})` })}
      ></span>`;
    }

    return html`<slot part="icon" name="icon"></slot>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderTrailingIcon(): TemplateResult {
    return when(
      this.deletable,
      () => html`<span part="delete" class="delete">
        <mdui-icon-clear></mdui-icon-clear>
      </span>`,
    );
  }

  protected renderInner(): TemplateResult[] {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon(),
    ];
  }

  protected override render(): TemplateResult {
    const { disabled, href } = this;

    return html`<mdui-ripple></mdui-ripple>${href
        ? disabled
          ? html`<span part="button" class="button">
              ${this.renderInner()}
            </span>`
          : // @ts-ignore
            this.renderAnchor({
              className: 'button',
              part: 'button',
              content: this.renderInner(),
            })
        : // @ts-ignore
          this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })}${this.renderLoading()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}

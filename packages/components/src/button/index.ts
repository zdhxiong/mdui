import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { when } from 'lit/directives/when.js';
import type { MaterialIconsName } from '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 按钮的文本
 * @slot icon - 按钮的图标
 *
 * @csspart label - 文本
 * @csspart icon - 图标
 * @csspart loading - 加载中动画
 */
@customElement('mdui-button')
export class Button extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @query('.button')
  protected focusProxiedElement!: HTMLElement;

  /**
   * 按钮形状。可选值为：
   * * `elevated`
   * * `filled`
   * * `tonal`
   * * `outlined`
   * * `text`
   * * `icon`
   */
  @property({ reflect: true })
  public variant:
    | 'elevated' /*预览图*/
    | 'filled' /*预览图*/
    | 'tonal' /*预览图*/
    | 'outlined' /*预览图*/
    | 'text' /*预览图*/
    | 'icon' /*预览图*/ = 'filled';

  /**
   * 是否填满父元素宽度
   */
  @property({ type: Boolean, reflect: true })
  public fullwidth = false;

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 图标是否置于右侧
   */
  @property({ type: Boolean, reflect: true })
  public trailingIcon = false;

  protected renderLeadingIcon(): TemplateResult {
    return html`${when(!this.trailingIcon, () => this.renderIcon())}`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderTrailingIcon(): TemplateResult {
    return html`${when(this.trailingIcon, () => this.renderIcon())}`;
  }

  protected renderIcon(): TemplateResult {
    return this.icon
      ? html`<mdui-icon part="icon" class="icon" name=${this.icon}></mdui-icon>`
      : html`<slot part="icon" name="icon"></slot>`;
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
          ? html`<span class="button">${this.renderInner()}</span>`
          : // @ts-ignore
            this.renderAnchor({
              className: 'button',
              content: this.renderInner(),
            })
        : // @ts-ignore
          this.renderButton({
            className: 'button',
            content: this.renderInner(),
          })}${this.renderLoading()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': Button;
  }
}

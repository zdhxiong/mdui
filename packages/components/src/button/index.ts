import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { when } from 'lit/directives/when.js';
import type { MaterialIconsName } from '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @slot - 按钮的文本
 * @slot icon - 按钮的图标
 *
 * @csspart label - 文本
 * @csspart icon - 图标
 */
@customElement('mdui-button')
export class Button extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @queryAll('.button')
  protected focusProxiedElements!: HTMLElement[];

  /**
   * 是否加载中状态
   */
  @property({ type: Boolean, reflect: true })
  public loading = false;

  /**
   * 按钮形式
   */
  @property({ reflect: true })
  public variant:
    | 'elevated' /*预览图*/
    | 'filled' /*预览图*/
    | 'tonal' /*预览图*/
    | 'outlined' /*预览图*/
    | 'text' /*预览图*/
    | 'icon' /*预览图*/ = 'text';

  /**
   * 是否填满父元素宽度
   */
  @property({ type: Boolean, reflect: true })
  public fullwidth = false;

  /**
   * 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 图标是否置于右侧
   */
  @property({ type: Boolean, reflect: true })
  public trailingIcon = false;

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`${when(!this.trailingIcon, () => this.renderIcon())}`;
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
          : this.renderAnchor({
              className: 'button',
              content: this.renderInner(),
            })
        : this.renderButton({
            className: 'button',
            content: this.renderInner(),
          })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': Button;
  }
}

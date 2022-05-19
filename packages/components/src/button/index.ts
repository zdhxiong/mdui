import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
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
 * @slot start - 按钮左侧元素
 * @slot end - 按钮右侧元素
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart label - 文本
 * @csspart start - 左侧的元素
 * @csspart end - 右侧的元素
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
   */
  @property({ reflect: true })
  public variant:
    | 'elevated' /*预览图*/
    | 'filled' /*预览图*/
    | 'tonal' /*预览图*/
    | 'outlined' /*预览图*/
    | 'text' /*预览图*/ = 'filled';

  /**
   * 是否填满父元素宽度
   */
  @property({ type: Boolean, reflect: true })
  public fullwidth = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public endIcon!: MaterialIconsName;

  protected renderStart(): TemplateResult {
    return this.icon
      ? html`<mdui-icon
          part="start"
          class="icon"
          name=${this.icon}
        ></mdui-icon>`
      : html`<slot part="start" name="start"></slot>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderEnd(): TemplateResult {
    return this.endIcon
      ? html`<mdui-icon
          part="end"
          class="icon"
          name=${this.endIcon}
        ></mdui-icon>`
      : html`<slot part="end" name="end"></slot>`;
  }

  protected renderInner(): TemplateResult[] {
    return [this.renderStart(), this.renderLabel(), this.renderEnd()];
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
    'mdui-button': Button;
  }
}

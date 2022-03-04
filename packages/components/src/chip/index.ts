import { customElement } from 'lit/decorators/custom-element.js';
import { CSSResultGroup, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';
import '@mdui/icons/check.js';
import '@mdui/icons/clear.js';

/**
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart label - 文本
 * @csspart check - 选中状态图标
 * @csspart icon - 图标
 * @csspart avatar - 头像
 * @csspart delete - 删除图标
 */
@customElement('mdui-chip')
export class Chip extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @queryAll('.button')
  protected focusProxiedElements!: HTMLElement[];

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ reflect: true })
  public variant: 'assist' | 'filter' | 'input' | 'suggestion' = 'assist';

  @property({ type: Boolean, reflect: true })
  public elevated = false;

  @property({ type: Boolean, reflect: true })
  public selectable = false;

  @property({ type: Boolean, reflect: true })
  public selected = false;

  @property({ type: Boolean, reflect: true })
  public deletable = false;

  @property({ reflect: true })
  public icon!: MaterialIconsName;

  @property({ reflect: true })
  public avatar!: string;

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

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
          ? html`<span class="button chip">${this.renderInner()}</span>`
          : this.renderAnchor({
              className: 'button chip',
              content: this.renderInner(),
            })
        : this.renderButton({
            className: 'button chip',
            content: this.renderInner(),
          })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}

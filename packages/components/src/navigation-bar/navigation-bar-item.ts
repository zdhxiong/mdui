import { customElement } from 'lit/decorators/custom-element.js';
import { html, LitElement, nothing, CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { query } from 'lit/decorators/query.js';
import { state } from 'lit/decorators/state.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import { style } from './navigation-bar-item-style.js';
import '../icon.js';

@customElement('mdui-navigation-bar-item')
export class NavigationBarItem extends RippleMixin(LitElement) {
  static override styles: CSSResultGroup = style;

  /**
   * 仅供父组件 navigation-bar 调用
   */
  @property({ reflect: true })
  public labelVisibility!: 'selected' | 'labeled' | 'unlabeled';

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @state()
  protected disabled = false;

  @property({ reflect: true })
  public href!: string;

  @property({ reflect: true })
  public download!: string;

  @property({ reflect: true })
  public target!: string;

  @property({ reflect: true })
  public rel!: string;

  @property({ reflect: true })
  public icon!: string;

  @property({ reflect: true })
  public iconVariant!: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';

  @property({ reflect: true })
  public activeIcon!: string;

  @property({ reflect: true })
  public activeIconVariant!:
    | 'outlined'
    | 'filled'
    | 'round'
    | 'sharp'
    | 'two-tone';

  @property({ reflect: true })
  public badge!: string;

  @property({ type: Boolean, reflect: true })
  public active = false;

  /**
   * value，若未指定，则默认为 index
   */
  @property({ reflect: true })
  public value!: string;

  protected renderIcon(): TemplateResult {
    if (this.icon) {
      return html`<mdui-icon
        class="icon"
        name=${this.icon}
        variant=${ifDefined(this.iconVariant)}
      ></mdui-icon>`;
    }

    return html`<slot name="icon"></slot>`;
  }

  protected renderActiveIcon(): TemplateResult {
    if (this.activeIcon) {
      return html`<mdui-icon
        class="active-icon"
        name=${this.activeIcon}
        variant=${ifDefined(this.activeIconVariant)}
      ></mdui-icon>`;
    }

    return html`<slot name="activeIcon"></slot>`;
  }

  protected renderBadge(): TemplateResult | typeof nothing {
    const { badge } = this;

    if (badge === undefined) {
      return nothing;
    }

    if (!badge) {
      return html`<span class="dot"></span>`;
    }

    return html`<span class="badge">${badge}</span>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="label"><slot></slot></span>`;
  }

  protected override render(): TemplateResult {
    const { href, download, target, rel } = this;

    return html`<mdui-ripple></mdui-ripple>
      <a
        class="item"
        href=${href ?? 'javascript:;'}
        download=${ifDefined(download)}
        target=${ifDefined(target)}
        rel=${ifDefined(rel)}
      >
        <span class="icon-container">
          ${this.renderBadge()}${this.renderActiveIcon()}${this.renderIcon()}
        </span>
        ${this.renderLabel()}
      </a>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar-item': NavigationBarItem;
  }
}

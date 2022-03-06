import { customElement } from 'lit/decorators/custom-element.js';
import { html, LitElement, nothing, CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { query } from 'lit/decorators/query.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { Ripple } from '../ripple/index.js';
import type { MaterialIconsName } from '../icon.js';
import { navigationBarItemStyle } from './navigation-bar-item-style.js';
import '../icon.js';

/**
 * @slot - 文本
 * @slot icon - 图标
 * @slot activeIcon - 激活状态的图标
 *
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @csspart label - 文本
 * @csspart dot - 圆点
 * @csspart badge - 小徽标
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 */
@customElement('mdui-navigation-bar-item')
export class NavigationBarItem extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [
    componentStyle,
    navigationBarItemStyle,
  ];

  /**
   * 仅供父组件 navigation-bar 调用
   */
  @property({ reflect: true })
  public labelVisibility!: 'selected' | 'labeled' | 'unlabeled';

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  @queryAll('.item')
  protected focusProxiedElements!: HTMLElement[];

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'icon',
    'activeIcon',
  );

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
  public icon!: MaterialIconsName;

  @property({ reflect: true })
  public activeIcon!: MaterialIconsName;

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
        part="icon"
        class="icon"
        name=${this.icon}
      ></mdui-icon>`;
    }

    return html`<slot part="icon" name="icon"></slot>`;
  }

  protected renderActiveIcon(): TemplateResult {
    if (this.activeIcon) {
      return html`<mdui-icon
        part="active-icon"
        class="active-icon"
        name=${this.activeIcon}
      ></mdui-icon>`;
    }

    return html`<slot part="active-icon" name="activeIcon"></slot>`;
  }

  protected renderBadge(): TemplateResult | typeof nothing {
    const { badge } = this;

    if (badge === undefined) {
      return nothing;
    }

    if (!badge) {
      return html`<span part="dot" class="dot"></span>`;
    }

    return html`<span part="badge" class="badge">${badge}</span>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
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
        <span
          class="indicator ${classMap({
            'has-active-icon': this.hasSlotController.test('activeIcon'),
          })}"
        >
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

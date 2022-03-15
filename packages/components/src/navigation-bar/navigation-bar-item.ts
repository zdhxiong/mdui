import { customElement } from 'lit/decorators/custom-element.js';
import { html, LitElement, nothing, CSSResultGroup, TemplateResult } from 'lit';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { state } from 'lit/decorators/state.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
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
 * @event keydown - 聚焦状态下，按下按键时触发
 *
 * @csspart label - 文本
 * @csspart dot - 圆点
 * @csspart badge - 小徽标
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 */
@customElement('mdui-navigation-bar-item')
export class NavigationBarItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  static override styles: CSSResultGroup = [
    componentStyle,
    navigationBarItemStyle,
  ];

  /**
   * 仅供父组件 navigation-bar 调用
   */
  @property({ reflect: true })
  protected labelVisibility!: 'selected' | 'labeled' | 'unlabeled';

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

  /**
   * 未激活状态的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 激活状态的 Material Icons 图标名
   */
  @property({ reflect: true })
  public activeIcon!: MaterialIconsName;

  /**
   * 角标。若为空字符串，则仅显示小红点；若指定了字符串值，则显示指定字符串
   */
  @property({ reflect: true })
  public badge!: string;

  /**
   * 是否为激活状态
   */
  @property({ type: Boolean, reflect: true })
  public active = false;

  /**
   * 在 `mdui-navigation-bar` 组件上获取当前选中的选项的值。若未指定，则默认为当前选项的索引位置
   */
  @property({ reflect: true })
  public value!: string;

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

  protected renderActiveIcon(): TemplateResult {
    return this.activeIcon
      ? html`<mdui-icon
          part="active-icon"
          class="active-icon"
          name=${this.activeIcon}
        ></mdui-icon>`
      : html`<slot part="active-icon" name="activeIcon"></slot>`;
  }

  protected renderIcon(): TemplateResult {
    return this.icon
      ? html`<mdui-icon part="icon" class="icon" name=${this.icon}></mdui-icon>`
      : html`<slot part="icon" name="icon"></slot>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderInner(): TemplateResult {
    return html`<span
        class="indicator ${classMap({
          'has-active-icon':
            this.activeIcon || this.hasSlotController.test('activeIcon'),
        })}"
      >
        ${this.renderBadge()}${this.renderActiveIcon()}${this.renderIcon()}
      </span>
      ${this.renderLabel()}`;
  }

  protected override render(): TemplateResult {
    const { href } = this;

    return html`<mdui-ripple></mdui-ripple>
      ${href
        ? // @ts-ignore
          this.renderAnchor({
            className: 'item',
            content: this.renderInner(),
          })
        : html`<span class="item">${this.renderInner()}</span>`} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar-item': NavigationBarItem;
  }
}

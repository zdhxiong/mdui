import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import cc from 'classcat';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { classMap } from 'lit/directives/class-map.js';
import type { Ripple } from '../ripple/index.js';
import type { MaterialIconsName } from '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { navigationRailItemStyle } from './navigation-rail-item-style.js';
import '../icon.js';

/**
 * @slot - 文本
 * @slot icon - 图标
 * @slot activeIcon - 激活状态的图标
 * @slot badge - 徽标
 *
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @csspart label - 文本
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 *
 * @cssprop --shape-corner-indicator 指示器的圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-navigation-rail-item')
export class NavigationRailItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  static override styles: CSSResultGroup = [
    componentStyle,
    navigationRailItemStyle,
  ];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'activeIcon',
  );

  // 每一个 `navigation-rail-item` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  protected get focusDisabled(): boolean {
    return this.disabled;
  }

  protected get focusElement(): HTMLElement {
    return this.href ? this.renderRoot.querySelector('._a')! : this;
  }

  protected get rippleDisabled(): boolean {
    return this.disabled;
  }

  // 是否禁用该元素，该组件没有禁用状态
  @state() protected disabled = false;

  /**
   * 是否为激活状态，有 `navigation-rail` 组件控制该参数
   */
  @property({ type: Boolean, reflect: true })
  protected active = false;

  /**
   * 未激活状态的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 激活状态的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'active-icon' })
  public activeIcon!: MaterialIconsName;

  /**
   * 导航项的值
   */
  @property({ reflect: true })
  public value = '';

  protected renderBadge(): TemplateResult {
    return html`<slot name="badge"></slot>`;
  }

  protected renderActiveIcon(): TemplateResult {
    return html`<slot name="activeIcon">
      ${when(
        this.activeIcon,
        () => html`<mdui-icon
          part="active-icon"
          class="active-icon"
          name=${this.activeIcon}
        ></mdui-icon>`,
      )}
    </slot>`;
  }

  protected renderIcon(): TemplateResult {
    return html`<slot name="icon">
      ${when(
        this.icon,
        () => html`<mdui-icon
          part="icon"
          class="icon"
          name=${this.icon}
        ></mdui-icon>`,
      )}
    </slot>`;
  }

  protected renderLabel(
    hasDefaultSlot: boolean,
  ): TemplateResult | typeof nothing {
    if (!hasDefaultSlot) {
      return nothing;
    }

    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderInner(hasDefaultSlot: boolean): TemplateResult {
    return html`<span
        class="indicator ${classMap({
          'has-active-icon':
            this.activeIcon || this.hasSlotController.test('activeIcon'),
        })}"
      >
        ${this.renderBadge()}${this.renderActiveIcon()}${this.renderIcon()}
      </span>
      ${this.renderLabel(hasDefaultSlot)}`;
  }

  protected override render(): TemplateResult {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const className = cc({
      item: true,
      'has-label': hasDefaultSlot,
    });

    return html`${this.href
        ? // @ts-ignore
          this.renderAnchor({
            className,
            content: this.renderInner(hasDefaultSlot),
          })
        : html`<span class=${className}>
            ${this.renderInner(hasDefaultSlot)}
          </span>`}<mdui-ripple .noRipple=${!this.active}></mdui-ripple>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-rail-item': NavigationRailItem;
  }
}

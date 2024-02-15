import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { navigationRailItemStyle } from './navigation-rail-item-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 侧边导航项组件。需配合 `<mdui-navigation-rail>` 组件使用
 *
 * ```html
 * <mdui-navigation-rail>
 * ..<mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
 * </mdui-navigation-rail>
 * ```
 *
 * @slot - 文本内容
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标
 * @slot badge - 徽标
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @csspart container - 导航项容器
 * @csspart indicator - 指示器
 * @csspart badge - 徽标
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 * @csspart label - 文本内容
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-navigation-rail-item')
export class NavigationRailItem extends AnchorMixin(
  RippleMixin(FocusableMixin(MduiElement)),
)<NavigationRailItemEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    navigationRailItemStyle,
  ];

  /**
   * 未激活状态下的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 激活状态下的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
   */
  @property({ reflect: true, attribute: 'active-icon' })
  public activeIcon?: string;

  /**
   * 导航项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 是否为激活状态，由 `<mdui-navigation-rail>` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected active = false;

  /**
   * 是否是初始状态，不显示动画。由 `<mdui-navigation-rail>` 组件控制该参数
   */
  @state()
  protected isInitial = true;

  /**
   * 导航栏的位置，由 `<mdui-navigation-rail>` 组件控制该参数
   */
  @state()
  protected placement: 'left' | 'right' = 'left';

  // 是否禁用该元素，该组件没有禁用状态
  @state()
  private disabled = false;

  // 每一个 `<mdui-navigation-rail-item>` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'active-icon',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  protected override get focusElement(): HTMLElement | null {
    return this.href ? this.renderRoot?.querySelector('._a') : this;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled;
  }

  protected override render(): TemplateResult {
    const hasDefaultSlot = this.hasSlotController.test('[default]');
    const className = cc({
      container: true,
      'has-label': hasDefaultSlot,
      'has-active-icon':
        this.activeIcon || this.hasSlotController.test('active-icon'),
      initial: this.isInitial,
    });

    return html`${this.href
        ? this.renderAnchor({
            part: 'container',
            className,
            content: this.renderInner(hasDefaultSlot),
          })
        : html`<div part="container" class=${className}>
            ${this.renderInner(hasDefaultSlot)}
          </div>`}
      <mdui-ripple
        .noRipple=${!this.active || this.noRipple}
        ${ref(this.rippleRef)}
      ></mdui-ripple>`;
  }

  private renderInner(hasDefaultSlot: boolean): TemplateResult {
    return html`<div part="indicator" class="indicator">
        <slot
          name="badge"
          part="badge"
          class=${classMap({
            badge: true,
            'placement-right': this.placement === 'right',
          })}
        ></slot>
        <slot name="active-icon" part="active-icon" class="active-icon">
          ${this.activeIcon
            ? html`<mdui-icon name=${this.activeIcon}></mdui-icon>`
            : nothingTemplate}
        </slot>
        <slot name="icon" part="icon" class="icon">
          ${this.icon
            ? html`<mdui-icon name=${this.icon}></mdui-icon>`
            : nothingTemplate}
        </slot>
      </div>
      ${hasDefaultSlot
        ? html`<slot part="label" class="label"></slot>`
        : nothing}`;
  }
}

export interface NavigationRailItemEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-rail-item': NavigationRailItem;
  }
}

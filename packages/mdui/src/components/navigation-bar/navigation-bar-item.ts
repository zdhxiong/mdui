import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { navigationBarItemStyle } from './navigation-bar-item-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 底部导航栏项组件。需与 `<mdui-navigation-bar>` 组件配合使用
 *
 * ```html
 * <mdui-navigation-bar>
 * ..<mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
 * </mdui-navigation-bar>
 * ```
 *
 * @slot - 文本
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标元素
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
 * @csspart label - 文本
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-navigation-bar-item')
export class NavigationBarItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    navigationBarItemStyle,
  ];

  /**
   * 未激活状态的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 激活状态的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
   */
  @property({ reflect: true, attribute: 'active-icon' })
  public activeIcon?: string;

  /**
   * 该导航项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 文本的可视状态，由 `navigation-bar` 调用
   */
  @property({ reflect: true, attribute: 'label-visibility' })
  protected labelVisibility?: 'selected' | 'labeled' | 'unlabeled';

  /**
   * 是否为激活状态，由 `navigation-bar` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected active = false;

  // 是否禁用该元素，该组件没有禁用状态
  @state()
  private disabled = false;

  // 每一个 `navigation-bar-item` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
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
    const className = cc({
      container: true,
      'has-active-icon':
        this.activeIcon || this.hasSlotController.test('active-icon'),
    });

    return html`<mdui-ripple
        .noRipple=${!this.active || this.noRipple}
        ${ref(this.rippleRef)}
      ></mdui-ripple>
      ${this.href
        ? this.renderAnchor({
            part: 'container',
            className,
            content: this.renderInner(),
          })
        : html`<div part="container" class=${className}>
            ${this.renderInner()}
          </div>`} `;
  }

  private renderInner(): TemplateResult {
    return html`<div part="indicator" class="indicator">
        <slot name="badge" part="badge" class="badge"></slot>
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
      <slot part="label" class="label"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-bar-item': NavigationBarItem;
  }
}

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { tabStyle } from './tab-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 选项卡项组件。需与 `<mdui-tabs>` 和 `<mdui-tab-panel>` 组件配合使用
 *
 * ```html
 * <mdui-tabs value="tab-1">
 * ..<mdui-tab value="tab-1">Tab 1</mdui-tab>
 * ..<mdui-tab value="tab-2">Tab 2</mdui-tab>
 * ..<mdui-tab value="tab-3">Tab 3</mdui-tab>
 *
 * ..<mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
 * </mdui-tabs>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 选项卡导航项的文本
 * @slot icon - 选项卡导航项中的图标
 * @slot badge - 徽标
 * @slot custom - 自定义整个选项卡导航项中的内容
 *
 * @csspart container - 导航项容器
 * @csspart icon - 导航项中的图标
 * @csspart label - 导航项的文本
 */
@customElement('mdui-tab')
export class Tab extends RippleMixin(FocusableMixin(MduiElement))<TabEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, tabStyle];

  /**
   * 该选项卡导航项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 是否把图标和文本水平排列
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public inline = false;

  /**
   * 是否为激活状态，由 `<mdui-tabs>` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected active = false;

  /**
   * 选项卡形状。由 `<mdui-tabs>` 组件控制该参数
   */
  @state()
  protected variant: 'primary' | 'secondary' = 'primary';

  // 每一个 `<mdui-tab>` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'custom',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return false;
  }

  protected override get focusElement(): HTMLElement {
    return this;
  }

  protected override get focusDisabled(): boolean {
    return false;
  }

  protected override render(): TemplateResult {
    const hasIcon = this.icon || this.hasSlotController.test('icon');
    const hasCustomSlot = this.hasSlotController.test('custom');

    const renderBadge = (): TemplateResult => html`<slot name="badge"></slot>`;

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      <div
        part="container"
        class=${classMap({
          container: true,
          preset: !hasCustomSlot,
          'variant-secondary': this.variant === 'secondary',
        })}
      >
        <slot name="custom">
          <div class="icon-container">
            ${when(hasIcon || this.icon, renderBadge)}
            <slot name="icon" part="icon" class="icon">
              ${this.icon
                ? html`<mdui-icon name=${this.icon}></mdui-icon>`
                : nothingTemplate}
            </slot>
          </div>
          <div class="label-container">
            ${when(!hasIcon, renderBadge)}
            <slot part="label" class="label"></slot>
          </div>
        </slot>
      </div>`;
  }
}

export interface TabEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tab': Tab;
  }
}

import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { tabStyle } from './tab-style.js';
import type { MaterialIconsName } from '../icon/index.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 选项卡导航项的文本
 * @slot icon - 选项卡导航项中的图标
 * @slot badge - 徽标
 * @slot custom - 自定义整个选项卡导航项中的内容
 *
 * @csspart tab - 选项卡导航项容器
 * @csspart icon - 选项卡导航项中的图标
 * @csspart label - 选项卡导航项的文本
 */
@customElement('mdui-tab')
export class Tab extends RippleMixin(FocusableMixin(LitElement)) {
  static override styles: CSSResultGroup = [componentStyle, tabStyle];

  @query('mdui-ripple', true)
  protected rippleElement!: Ripple;

  // 每一个 `<mdui-tab>` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  protected get focusDisabled(): boolean {
    return false;
  }

  protected get focusElement(): HTMLElement {
    return this;
  }

  protected get rippleDisabled(): boolean {
    return false;
  }

  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'custom',
  );

  /**
   * 是否为激活状态，由 `<mdui-tabs>` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  protected active = false;

  /**
   * 选项卡形状。由 `<mdui-tabs>` 组件控制该参数
   */
  @property({ reflect: true })
  protected variant: 'primary' | 'secondary' = 'primary';

  /**
   * 该选项卡导航项的值
   */
  @property({ reflect: true })
  public value = '';

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 是否把图标和文本水平排列
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public inline = false;

  private renderBadge(): TemplateResult {
    return html`<slot name="badge"></slot>`;
  }

  protected override render(): TemplateResult {
    const hasIconSlot = this.hasSlotController.test('icon');
    const hasCustomSlot = this.hasSlotController.test('custom');

    const className = cc({
      item: true,
      preset: !hasCustomSlot,
    });

    return html`<mdui-ripple></mdui-ripple>
      <div part="tab" class="${className}">
        <slot name="custom">
          <div part="icon" class="icon">
            ${when(hasIconSlot || this.icon, this.renderBadge)}
            <slot name="icon">
              ${when(
                this.icon,
                () => html`<mdui-icon name=${this.icon}></mdui-icon>`,
              )}
            </slot>
          </div>
          <div part="label" class="label">
            ${when(!hasIconSlot && !this.icon, this.renderBadge)}
            <slot></slot>
          </div>
        </slot>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tab': Tab;
  }
}

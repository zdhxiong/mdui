import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 卡片组件
 *
 * ```html
 * <mdui-card>card content</mdui-card>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 卡片内容
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-card')
export class Card extends AnchorMixin(
  RippleMixin(FocusableMixin(MduiElement)),
)<CardEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 卡片形状。可选值为：
   *
   * * `elevated`：具有阴影，与背景的分离度比 `filled` 更高，但小于 `outlined`
   * * `filled`：与背景的分离度最小
   * * `outlined`：具有边框，与背景的分离度最大
   */
  @property({ reflect: true })
  public variant:
    | /*具有阴影，与背景的分离度比 `filled` 更高，但小于 `outlined`*/ 'elevated'
    | /*与背景的分离度最小*/ 'filled'
    | /*具有边框，与背景的分离度最大*/ 'outlined' = 'elevated';

  /**
   * 是否可点击。为 `true` 时，会添加鼠标悬浮效果、及点击涟漪效果
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public clickable = false;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  private readonly rippleRef: Ref<Ripple> = createRef();

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled || (!this.href && !this.clickable);
  }

  protected override get focusElement(): HTMLElement | null {
    return this.href && !this.disabled
      ? this.renderRoot.querySelector('._a')
      : this;
  }

  protected override get focusDisabled(): boolean {
    return this.rippleDisabled;
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple
      >${this.href && !this.disabled
        ? this.renderAnchor({
            className: 'link',
            content: html`<slot></slot>`,
          })
        : html`<slot></slot>`}`;
  }
}

export interface CardEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-card': Card;
  }
}

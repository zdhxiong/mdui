import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '@mdui/shared/icons/check-circle.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 图片选择组件。可配合 `<mdui-image-select-group>` 组件使用
 *
 * ```html
 * <mdui-image-select src="https://example.com/image.jpg" value="1"></mdui-image-select>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 *
 * @slot - 自定义图片内容，可以为 `<img>` 元素或其他内容
 *
 * @csspart image - 组件内部的 `<img>` 元素
 * @csspart indicator - 选中状态的指示器图标
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用设计令牌
 */
@customElement('mdui-image-select')
export class ImageSelect extends RippleMixin(
  FocusableMixin(MduiElement),
)<ImageSelectEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 图片的 URL 地址
   */
  @property({ reflect: true })
  public src?: string;

  /**
   * 图片的替代文本描述
   */
  @property({ reflect: true })
  public alt?: string;

  /**
   * 图片如何适应容器框，与原生的 `object-fit` 属性相同。可选值包括：
   *
   * * `contain`：保持图片原有尺寸比例，内容会被等比例缩放
   * * `cover`：保持图片原有尺寸比例，但部分内容可能被剪切
   * * `fill`：不保持图片原有尺寸比例，内容会被拉伸以填充整个容器
   * * `none`：保留图片原有尺寸，内容不会被缩放或拉伸
   * * `scale-down`：保持图片原有尺寸比例，内容尺寸与 `none` 或 `contain` 中较小的一个相同
   */
  @property({ reflect: true })
  public fit?:
    | /*保持图片原有尺寸比例，内容会被等比例缩放*/ 'contain'
    | /*保持图片原有尺寸比例，但部分内容可能被剪切*/ 'cover'
    | /*不保持图片原有尺寸比例，内容会被拉伸以填充整个容器*/ 'fill'
    | /*保留图片原有尺寸，内容不会被缩放或拉伸*/ 'none'
    | /*保持图片原有尺寸比例，内容尺寸与 `none` 或 `contain` 中较小的一个相同*/ 'scale-down';

  /**
   * 是否为选中状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public selected = false;

  /**
   * 是否为禁用状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 图片选择的值，将被 `<mdui-image-select-group>` 使用
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 是否被 group 组件禁用（内部使用）
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'group-disabled',
  })
  public groupDisabled = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(this, '[default]');

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  protected override get focusElement(): HTMLElement {
    return this;
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      <div class="content">
        ${this.hasSlotController.test('[default]')
          ? html`<slot></slot>`
          : this.src
            ? html`<img
                part="image"
                alt=${ifDefined(this.alt)}
                src=${this.src}
                style=${styleMap({ objectFit: this.fit ?? 'cover' })}
              />`
            : nothingTemplate}
      </div>
      <div class="indicator" part="indicator">
        <mdui-icon-check-circle></mdui-icon-check-circle>
      </div>`;
  }

  /**
   * 仅在非 group 内使用时，自行切换选中状态
   */
  private readonly onClick = () => {
    if (this.disabled || this.groupDisabled) {
      return;
    }

    // 在 group 中时，由 group 管理选中状态
    if (this.closest('mdui-image-select-group')) {
      return;
    }

    this.selected = !this.selected;
    this.emit('change');
  };
}

export interface ImageSelectEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-image-select': ImageSelect;
  }
}

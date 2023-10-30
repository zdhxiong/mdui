import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { getInnerHtmlFromSlot } from '@mdui/shared/helpers/slot.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { topAppBarTitleStyle } from './top-app-bar-title-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 顶部应用栏标题组件。需与 `<mdui-top-app-bar>` 组件配合使用
 *
 * ```html
 * <mdui-top-app-bar>
 * ..<mdui-button-icon icon="menu"></mdui-button-icon>
 * ..<mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-button-icon icon="more_vert"></mdui-button-icon>
 * </mdui-top-app-bar>
 * ```
 *
 * @slot - 顶部应用栏的标题文本
 * @slot label-large - 展开状态的标题文本
 *
 * @csspart label 文本内容
 * @csspart label-large 展开状态的文本内容
 */
@customElement('mdui-top-app-bar-title')
export class TopAppBarTitle extends LitElement {
  public static override styles: CSSResultGroup = [
    componentStyle,
    topAppBarTitleStyle,
  ];

  /**
   * 顶部应用栏形状。由 mdui-top-app-bar 组件控制该参数
   */
  @state()
  private variant:
    | 'center-aligned' /*预览图*/
    | 'small' /*预览图*/
    | 'medium' /*预览图*/
    | 'large' /*预览图*/ = 'small';

  /**
   * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效。由 mdui-top-app-bar 组件控制该参数
   */
  @state()
  private shrink = false;

  private readonly hasSlotController = new HasSlotController(
    this,
    'label-large',
  );
  private readonly labelLargeRef: Ref<HTMLElement> = createRef();
  private readonly defaultSlotRef: Ref<HTMLSlotElement> = createRef();

  protected override render(): TemplateResult {
    const hasLabelLargeSlot = this.hasSlotController.test('label-large');

    const className = classMap({
      shrink: this.shrink,
      'variant-center-aligned': this.variant === 'center-aligned',
      'variant-small': this.variant === 'small',
      'variant-medium': this.variant === 'medium',
      'variant-large': this.variant === 'large',
    });

    return html`<slot
        part="label"
        class="label ${className}"
        ${ref(this.defaultSlotRef)}
        @slotchange="${() => this.onSlotChange(hasLabelLargeSlot)}"
      ></slot>
      ${hasLabelLargeSlot
        ? html`<slot
            name="label-large"
            part="label-large"
            class="label-large ${className}"
          ></slot>`
        : html`<div
            ${ref(this.labelLargeRef)}
            part="label-large"
            class="label-large ${className}"
          ></div>`}`;
  }

  /**
   * default slot 变化时，同步到 label-large 中
   * @param hasLabelLargeSlot
   * @private
   */
  private onSlotChange(hasLabelLargeSlot: boolean) {
    if (!hasLabelLargeSlot) {
      this.labelLargeRef.value!.innerHTML = getInnerHtmlFromSlot(
        this.defaultSlotRef.value!,
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar-title': TopAppBarTitle;
  }
}

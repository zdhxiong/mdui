import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { getInnerHtmlFromSlot } from '@mdui/shared/helpers/slot.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { topAppBarTitleStyle } from './top-app-bar-title-style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @slot - 顶部应用栏的标题文本
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
  @property({ reflect: true })
  private variant:
    | 'center-aligned' /*预览图*/
    | 'small' /*预览图*/
    | 'medium' /*预览图*/
    | 'large' /*预览图*/ = 'small';

  /**
   * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效。由 mdui-top-app-bar 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private shrink = false;

  private readonly labelLargeRef: Ref<HTMLElement> = createRef();
  private readonly defaultSlotRef: Ref<HTMLSlotElement> = createRef();

  protected override render(): TemplateResult {
    return html`<div part="label" class="label">
        <slot
          ${ref(this.defaultSlotRef)}
          @slotchange="${this.onSlotChange}"
        ></slot>
      </div>
      <div
        ${ref(this.labelLargeRef)}
        part="label-large"
        class="label-large"
      ></div>`;
  }

  private onSlotChange() {
    this.labelLargeRef.value!.innerHTML = getInnerHtmlFromSlot(
      this.defaultSlotRef.value!,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar-title': TopAppBarTitle;
  }
}

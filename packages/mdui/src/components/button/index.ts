import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 按钮组件
 *
 * ```html
 * <mdui-button>Button</mdui-button>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 按钮的文本
 * @slot icon - 按钮左侧元素
 * @slot end-icon - 按钮右侧元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 按钮文本
 * @csspart icon - 按钮左侧图标
 * @csspart end-icon - 按钮右侧图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-button')
export class Button extends ButtonBase<ButtonEventMap> {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 按钮形状。可选值为：
   *
   * * `elevated`：带阴影的按钮，在需要把按钮和背景进行视觉分离时使用
   * * `filled`：视觉效果仅次于 FAB，用于重要流程的最终操作，如“保存”、“确认”等
   * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，用于中高优先级的操作，如流程中的“下一步”
   * * `outlined`：带边框的按钮，用于中等优先级，且次要的操作，如“返回”
   * * `text`：文本按钮，用于最低优先级的操作
   */
  @property({ reflect: true })
  public variant:
    | /*带阴影的按钮，在需要把按钮和背景进行视觉分离时使用*/ 'elevated'
    | /*视觉效果仅次于 FAB，用于重要流程的最终操作，如“保存”、“确认”等*/ 'filled'
    | /*视觉效果介于 `filled` 和 `outlined` 之间，用于中等偏高优先级的场景，如流程中的“下一步”*/ 'tonal'
    | /*带边框的按钮，用于中等优先级，且次要操作的场景，如“返回”*/ 'outlined'
    | /*文本按钮，用于最低优先级的操作*/ 'text' = 'filled';

  /**
   * 是否填满父元素宽度
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'full-width',
  })
  public fullWidth = false;

  /**
   * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  private readonly rippleRef: Ref<Ripple> = createRef();

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="button _a">
            ${this.renderInner()}
          </span>`
        : this.renderAnchor({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })}`;
  }

  private renderIcon(): TemplateResult {
    if (this.loading) {
      return this.renderLoading();
    }

    return html`<slot name="icon" part="icon" class="icon">
      ${this.icon
        ? html`<mdui-icon name=${this.icon}></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderLabel(): TemplateResult {
    return html`<slot part="label" class="label"></slot>`;
  }

  private renderEndIcon(): TemplateResult {
    return html`<slot name="end-icon" part="end-icon" class="end-icon">
      ${this.endIcon
        ? html`<mdui-icon name=${this.endIcon}></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderInner(): TemplateResult[] {
    return [this.renderIcon(), this.renderLabel(), this.renderEndIcon()];
  }
}

export interface ButtonEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button': Button;
  }
}

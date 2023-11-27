import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 图标按钮组件
 *
 * ```html
 * <mdui-button-icon icon="search"></mdui-button-icon>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 图标组件
 * @slot selected-icon 选中状态显示的图标元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart icon - 未选中状态的图标
 * @csspart selected-icon 选中状态的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-button-icon')
export class ButtonIcon extends ButtonBase<ButtonIconEventMap> {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 图标按钮的形状。可选值为：
   *
   * * `standard`：用于最低优先级的操作
   * * `filled`：具有最强视觉效果，用于高优先级的操作
   * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，用于中高优先级的操作
   * * `outlined`：用于中等优先级的操作
   */
  @property({ reflect: true })
  public variant:
    | /*用于最低优先级的操作*/ 'standard'
    | /*具有最强视觉效果，用于高优先级的操作*/ 'filled'
    | /*视觉效果介于 `filled` 和 `outlined` 之间，用于中高优先级的操作*/ 'tonal'
    | /*用于中等优先级的操作*/ 'outlined' = 'standard';

  /**
   * Material Icons 图标名。也可以通过 default slot 设置
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
   */
  @property({ reflect: true, attribute: 'selected-icon' })
  public selectedIcon?: string;

  /**
   * 是否可选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public selectable = false;

  /**
   * 是否已选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public selected = false;

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'selected-icon',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  @watch('selected', true)
  private onSelectedChange() {
    this.emit('change');
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.addEventListener('click', () => {
      if (!this.selectable || this.disabled) {
        return;
      }

      this.selected = !this.selected;
    });
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
            content: this.renderIcon(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="button _a">
            ${this.renderIcon()}
          </span>`
        : this.renderAnchor({
            className: 'button',
            part: 'button',
            content: this.renderIcon(),
          })}
      ${this.renderLoading()}`;
  }

  private renderIcon(): TemplateResult {
    const icon = () =>
      this.hasSlotController.test('[default]')
        ? html`<slot></slot>`
        : this.icon
        ? html`<mdui-icon
            part="icon"
            class="icon"
            name=${this.icon}
          ></mdui-icon>`
        : nothingTemplate;

    const selectedIcon = () =>
      this.hasSlotController.test('selected-icon') || this.selectedIcon
        ? html`<slot
            name="selected-icon"
            part="selected-icon"
            class="selected-icon"
          >
            <mdui-icon name=${this.selectedIcon}></mdui-icon>
          </slot>`
        : icon();

    return this.selected ? selectedIcon() : icon();
  }
}

export interface ButtonIconEventMap {
  focus: FocusEvent;
  blur: FocusEvent;
  change: CustomEvent<void>;
  invalid: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button-icon': ButtonIcon;
  }
}

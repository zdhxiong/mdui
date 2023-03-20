import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
import type { MaterialIconsName } from '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 *
 * @slot - 图标组件
 * @slot selected-icon 选中状态的图标组件
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart icon - 图标组件
 * @csspart selected-icon 选中状态的图标组件
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-button-icon')
export class ButtonIcon extends ButtonBase {
  public static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 图标按钮的形状。可选值为：
   * * `standard`
   * * `filled`
   * * `tonal`
   * * `outlined`
   */
  @property({ reflect: true })
  public variant:
    | 'standard' /*预览图*/
    | 'filled' /*预览图*/
    | 'tonal' /*预览图*/
    | 'outlined' /*预览图*/ = 'standard';

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 选中状态的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'selected-icon' })
  public selectedIcon!: MaterialIconsName;

  /**
   * 是否可选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public selectable = false;

  /**
   * 是否已选中
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
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
    emit(this, 'change');
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
    return html`<mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderIcon(),
          })
        : this.disabled || this.loading
        ? html`<span part="button" class="button">${this.renderIcon()}</span>`
        : this.renderAnchor({
            className: 'button',
            part: 'button',
            content: this.renderIcon(),
          })}
      ${this.renderLoading()}`;
  }

  private renderIcon(): TemplateResult {
    const icon = () => {
      return this.hasSlotController.test('[default]')
        ? html`<slot></slot>`
        : html`${when(
            this.icon,
            () =>
              html`<mdui-icon
                part="icon"
                class="icon"
                name=${this.icon}
              ></mdui-icon>`,
          )}`;
    };

    const selectedIcon =
      this.hasSlotController.test('selected-icon') || this.selectedIcon
        ? html`<slot name="selected-icon">
            <mdui-icon
              part="selected-icon"
              class="icon"
              name=${this.selectedIcon}
            ></mdui-icon>
          </slot>`
        : icon();

    return this.selected ? selectedIcon : icon();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-button-icon': ButtonIcon;
  }
}

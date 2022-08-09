import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import { when } from 'lit/directives/when.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';

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
@customElement('mdui-icon-button')
export class IconButton extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'selected-icon',
  );

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
  @property({ type: Boolean, reflect: true })
  public selectable = false;

  /**
   * 是否已选中
   */
  @property({ type: Boolean, reflect: true })
  public selected = false;

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    $(this).on('click', () => {
      if (!this.selectable || this.disabled) {
        return;
      }

      this.selected = !this.selected;
    });
  }

  @watch('selected', true)
  protected onSelectedChange() {
    emit(this, 'change');
  }

  protected renderIcon(): TemplateResult {
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

  protected override render(): TemplateResult {
    return html`<mdui-ripple></mdui-ripple>${this.href
        ? this.disabled
          ? html`<span part="button" class="button">${this.renderIcon()}</span>`
          : // @ts-ignore
            this.renderAnchor({
              className: 'button',
              part: 'button',
              content: this.renderIcon(),
            })
        : // @ts-ignore
          this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderIcon(),
          })}
      ${this.renderLoading()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-icon-button': IconButton;
  }
}

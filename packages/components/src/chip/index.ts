import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';
import '../avatar.js';
import '@mdui/icons/check.js';
import '@mdui/icons/clear.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart button - 内部的 button 或 a 元素
 * @csspart label - 文本
 * @csspart check - 选中状态图标
 * @csspart icon - 图标
 * @csspart avatar - 头像
 * @csspart delete - 删除图标
 * @csspart loading - 加载中动画
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-chip')
export class Chip extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  /**
   * 纸片形状。可选值为：
   * * `assist`
   * * `filter`
   * * `input`
   * * `suggestion`
   */
  @property({ reflect: true })
  public variant:
    | 'assist' /*预览图*/
    | 'filter' /*预览图*/
    | 'input' /*预览图*/
    | 'suggestion' = 'assist';

  /**
   * 是否包含阴影
   */
  @property({ type: Boolean, reflect: true })
  public elevated = false;

  /**
   * 是否可选中
   */
  @property({ type: Boolean, reflect: true })
  public selectable = false;

  /**
   * 是否为选中状态
   */
  @property({ type: Boolean, reflect: true })
  public selected = false;

  /**
   * 是否可删除。为 `true` 时，在右侧会显示删除图标
   */
  @property({ type: Boolean, reflect: true })
  public deletable = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 左侧的头像链接
   */
  @property({ reflect: true })
  public avatar!: string;

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    $(this).on({
      'click._chip': () => this.onClick(),
      'keydown._chip': (event) => this.onKeyDown(event as KeyboardEvent),
    });
  }

  private onClick() {
    if (this.disabled || this.loading) {
      return;
    }

    // 点击时，切换选中状态
    if (this.selectable) {
      this.selected = !this.selected;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading) {
      return;
    }

    // 按下空格键时，切换选中状态
    if (this.selectable && event.key === ' ') {
      event.preventDefault();
      this.selected = !this.selected;
    }

    // 按下 Delete 或 BackSpace 键时，触发 delete 事件
    if (this.deletable && ['Delete', 'Backspace'].includes(event.key)) {
      emit(this, 'delete');
    }
  }

  /**
   * 点击删除按钮
   */
  private onDelete(event: MouseEvent) {
    event.stopPropagation();
    emit(this, 'delete');
  }

  @watch('selected', true)
  private onSelectedChange() {
    emit(this, 'change');
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon">
      ${this.selected && ['assist', 'filter'].includes(this.variant)
        ? html`<mdui-icon-check part="check" class="icon"></mdui-icon-check>`
        : this.icon
        ? html`<mdui-icon
            part="icon"
            class="icon"
            name=${this.icon}
          ></mdui-icon>`
        : this.avatar
        ? html`<mdui-avatar
            part="avatar"
            class="avatar"
            fit="cover"
            src=${this.avatar}
          ></mdui-avatar>`
        : nothing}
    </slot>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderTrailingIcon(): TemplateResult {
    return when(
      this.deletable,
      () => html`<span part="delete" class="delete" @click=${this.onDelete}>
        <mdui-icon-clear></mdui-icon-clear>
      </span>`,
    );
  }

  protected renderInner(): TemplateResult[] {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon(),
    ];
  }

  protected override render(): TemplateResult {
    return html`<mdui-ripple></mdui-ripple>${this.href
        ? this.disabled || this.loading
          ? html`<span part="button" class="button">
              ${this.renderInner()}
            </span>`
          : // @ts-ignore
            this.renderAnchor({
              className: 'button',
              part: 'button',
              content: this.renderInner(),
            })
        : // @ts-ignore
          this.renderButton({
            className: 'button',
            part: 'button',
            content: this.renderInner(),
          })}
      ${this.renderLoading()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-chip': Chip;
  }
}

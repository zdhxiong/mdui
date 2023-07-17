import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import '@mdui/shared/icons/check.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { segmentedButtonStyle } from './segmented-button-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 分段按钮项的文本
 * @slot icon - 分段按钮项左侧的元素
 * @slot end-icon - 分段按钮项右侧的元素
 *
 * @csspart icon - 左侧的图标
 * @csspart checked-icon - 选中状态的左侧图标
 * @csspart end-icon - 右侧的图标
 * @csspart label - 文本内容的容器
 * @csspart loading - 加载状态图标
 */
@customElement('mdui-segmented-button')
export class SegmentedButton extends ButtonBase {
  public static override styles: CSSResultGroup = [
    ButtonBase.styles,
    segmentedButtonStyle,
  ];

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  /**
   * 是否选中该分段按钮项，由 mdui-segmented-button-group 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected selected = false;

  /**
   * 是否验证未通过。由 mdui-segmented-button-group 控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected invalid = false;

  // 父组件中是否设置了禁用。由 mdui-radio-group 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'group-disabled',
  })
  protected groupDisabled = false;

  // 每一个 segmented-button 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'icon',
    'end-icon',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return this.isDisabled() || this.loading;
  }

  protected override get focusDisabled(): boolean {
    return this.isDisabled() || this.loading;
  }

  protected override render(): TemplateResult {
    const hasIconSlot = this.hasSlotController.test('icon');
    const hasEndIconSlot = this.hasSlotController.test('end-icon');
    const className = cc({
      button: true,
      'has-icon': this.icon || hasIconSlot || this.selected || this.loading,
      'has-end-icon': this.endIcon || hasEndIconSlot,
    });

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.isButton()
        ? this.renderButton({
            className,
            part: 'button',
            content: this.renderInner(),
          })
        : this.isDisabled() || this.loading
        ? html`<span part="button" class="_a ${className}">
            ${this.renderInner()}
          </span>`
        : this.renderAnchor({
            className,
            part: 'button',
            content: this.renderInner(),
          })}`;
  }

  private isDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  private renderIcon(): TemplateResult {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.selected) {
      return html`<mdui-icon-check
        part="checked-icon"
        class="checked-icon"
      ></mdui-icon-check>`;
    }

    return html`<slot name="icon">
      ${this.icon
        ? html`<mdui-icon
            part="icon"
            class="icon"
            name=${this.icon}
          ></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderLabel(): TemplateResult {
    const hasLabel = this.hasSlotController.test('[default]');

    if (!hasLabel) {
      return nothingTemplate;
    }

    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  private renderEndIcon(): TemplateResult {
    return html`<slot name="end-icon">
      ${this.endIcon
        ? html`<mdui-icon
            part="end-icon"
            class="icon"
            name=${this.endIcon}
          ></mdui-icon>`
        : nothingTemplate}
    </slot>`;
  }

  private renderInner(): TemplateResult[] {
    return [this.renderIcon(), this.renderLabel(), this.renderEndIcon()];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-segmented-button': SegmentedButton;
  }
}

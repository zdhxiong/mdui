import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import type { MaterialIconsName } from '../icon.js';
import { ButtonBase } from '../button/button-base.js';
import { segmentedButtonItemStyle } from './segmented-button-item-style.js';
import '../icon.js';
import '@mdui/icons/check.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 分段按钮项的文本
 * @slot start - 分段按钮项左侧的元素
 * @slot end - 分段按钮项右侧的元素
 *
 * @csspart check - 选中状态的 check 图标
 * @csspart start - 左侧的元素
 * @csspart label - 文本内容的容器
 * @csspart end - 右侧的元素
 */
@customElement('mdui-segmented-button-item')
export class SegmentedButtonItem extends ButtonBase {
  static override styles: CSSResultGroup = [
    ButtonBase.styles,
    segmentedButtonItemStyle,
  ];

  protected readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'start',
    'end',
  );

  // 每一个 segmented-button-item 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  /**
   * 是否选中该分段按钮项，由 mdui-segmented-button 组件控制该参数
   */
  @property({ type: Boolean, reflect: true }) protected selected = false;

  /**
   * 左侧的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon!: MaterialIconsName;

  protected renderCheck(): TemplateResult | typeof nothing {
    if (!this.selected) {
      return nothing;
    }

    return html`<mdui-icon-check part="check" class="check"></mdui-icon-check>`;
  }

  protected renderStart(): TemplateResult | typeof nothing {
    const hasLabel = this.hasSlotController.test('[default]');

    if (hasLabel && this.selected) {
      return nothing;
    }

    return html`<slot name="start">
      ${when(
        this.icon,
        () => html`<mdui-icon
          part="start"
          class="icon"
          name=${this.icon}
        ></mdui-icon>`,
      )}
    </slot>`;
  }

  protected renderLabel(): TemplateResult | typeof nothing {
    const hasLabel = this.hasSlotController.test('[default]');

    if (!hasLabel) {
      return nothing;
    }

    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderEnd(): TemplateResult {
    return html`<slot name="end">
      ${when(
        this.endIcon,
        () => html`<mdui-icon
          part="end"
          class="icon"
          name=${this.endIcon}
        ></mdui-icon>`,
      )}
    </slot>`;
  }

  protected renderInner(): (TemplateResult | typeof nothing)[] {
    return [
      this.renderCheck(),
      this.renderStart(),
      this.renderLabel(),
      this.renderEnd(),
    ];
  }

  protected override render(): TemplateResult {
    const hasStartSlot = this.hasSlotController.test('start');
    const hasEndSlot = this.hasSlotController.test('end');
    const className = `button ${
      (this.icon || hasStartSlot) && !this.selected ? 'has-start' : ''
    } ${this.endIcon || hasEndSlot ? 'has-end' : ''}`;

    return html`<mdui-ripple></mdui-ripple>${this.href
        ? this.disabled || this.loading
          ? html`<span part="button" class=${className}>
              ${this.renderInner()}
            </span>`
          : // @ts-ignore
            this.renderAnchor({
              className,
              part: 'button',
              content: this.renderInner(),
            })
        : // @ts-ignore
          this.renderButton({
            className,
            part: 'button',
            content: this.renderInner(),
          })}${this.renderLoading()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-segmented-button-item': SegmentedButtonItem;
  }
}

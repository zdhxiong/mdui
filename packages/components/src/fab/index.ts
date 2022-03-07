import { html, TemplateResult, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { ButtonBase } from '../button/button-base.js';
import type { MaterialIconsName } from '../icon.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart label - 文本
 * @csspart icon - 图标
 */
@customElement('mdui-fab')
export class Fab extends ButtonBase {
  static override styles: CSSResultGroup = [ButtonBase.styles, style];

  @queryAll('.button')
  protected focusProxiedElements!: HTMLElement[];

  private readonly hasSlotController = new HasSlotController(this, 'icon');

  @property({ type: Boolean, reflect: true })
  public loading = false;

  @property({ reflect: true })
  public variant: 'primary' | 'surface' | 'secondary' | 'tertiary' = 'primary';

  @property({ reflect: true })
  public size: 'normal' | 'small' | 'large' = 'normal';

  @property({ reflect: true })
  public icon!: MaterialIconsName;

  @property({ reflect: true })
  public tooltip!: string;

  @property({ type: Boolean, reflect: true })
  public extended = false;

  /**
   * extended 变更时，设置动画
   */
  @watch('extended')
  private async onExtendedChange() {
    const hasUpdated = this.hasUpdated;

    if (!this.extended) {
      this.style.width = '';
    } else {
      this.style.width = `${this.scrollWidth}px`;
    }

    await this.updateComplete;

    if (this.extended && !hasUpdated) {
      await new Promise((r) => setTimeout(r, 0));
      this.style.width = `${this.scrollWidth}px`;
    }

    if (!hasUpdated) {
      // 延迟设置动画，避免首次渲染时也执行动画
      await new Promise((r) => setTimeout(r, 0));
      this.style.transitionProperty = 'width';
    }
  }

  protected renderLabel(): TemplateResult {
    return html`<span part="label" class="label"><slot></slot></span>`;
  }

  protected renderIcon(): TemplateResult {
    return this.icon
      ? html`<mdui-icon part="icon" class="icon" name=${this.icon}></mdui-icon>`
      : html`<slot part="icon" name="icon"></slot>`;
  }

  protected renderInner(): TemplateResult[] {
    return [this.renderIcon(), this.renderLabel()];
  }

  protected override render(): TemplateResult {
    const { disabled, href } = this;
    const hasIconSlot = this.hasSlotController.test('icon');
    const className = `button ${this.icon || hasIconSlot ? 'has-icon' : ''}`;

    return html`<mdui-ripple></mdui-ripple>${href
        ? disabled
          ? html`<span class=${className}>${this.renderInner()}</span>`
          : this.renderAnchor({
              className,
              content: this.renderInner(),
            })
        : this.renderButton({
            className,
            content: this.renderInner(),
          })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-fab': Fab;
  }
}

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/removeClass.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { Modal } from '@mdui/shared/helpers/modal.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import {
  EASING_DECELERATION,
  EASING_LINEAR,
} from '@mdui/shared/helpers/motion.js';
import { lockScreen, unlockScreen } from '@mdui/shared/helpers/scroll.js';
import {
  KEYFRAME_FADE_IN,
  KEYFRAME_FADE_OUT,
} from '@mdui/shared/helpers/motion.js';
import type { MaterialIconsName } from '../icon.js';
import type { TopAppBar } from '../top-app-bar/top-app-bar.js';
import { style } from './style.js';
import '../icon.js';

/**
 * @event open - 在对话框打开之前触发。可以通过调用 `event.preventDefault()` 阻止对话框打开
 * @event opened - 在对话框打开之后触发
 * @event close - 在对话框关闭之前触发。可以通过调用 `event.preventDefault()` 阻止对话框关闭
 * @event closed - 在对话框关闭之后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot header - 顶部元素，默认包含 icon slot 和 primary slot
 * @slot icon - 顶部图标
 * @slot primary - 顶部标题
 * @slot secondary - 标题下方的文本
 * @slot - 对话框主体内容
 * @slot action - 底部操作栏中的元素
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 对话框容器
 * @csspart header - 对话框 header 部分，其中包含了 icon 和 primary
 * @csspart icon - 顶部的图标
 * @csspart primary - 顶部的标题
 * @csspart body - 对话框的 body 部分
 * @csspart secondary - 副文本部分，位于 body 中
 * @csspart actions - 底部操作栏容器
 */
@customElement('mdui-dialog')
export class Dialog extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('.overlay', true)
  protected overlay!: HTMLElement;

  @query('.panel', true)
  protected panel!: HTMLElement;

  @query('.body', true)
  protected body!: HTMLElement;

  /**
   * dialog 组件内包含的 mdui-top-app-bar 组件
   */
  @queryAssignedElements({
    slot: 'header',
    selector: 'mdui-top-app-bar',
    flatten: true,
  })
  protected topAppBarElements!: TopAppBar[] | null;

  private readonly hasSlotController = new HasSlotController(
    this,
    'header',
    'icon',
    'primary',
    'secondary',
    'action',
    '[default]',
  );
  private modal!: Modal;

  // 用于在打开对话框前，记录当前聚焦的元素；在关闭对话框后，把焦点还原到该元素上
  private originalTrigger!: HTMLElement;

  /**
   * 顶部的 Material Icons 图标名
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 标题
   */
  @property({ reflect: true })
  public primary!: string;

  /**
   * 标题下方的文本
   */
  @property({ reflect: true })
  public secondary!: string;

  /**
   * 是否打开对话框
   */
  @property({ type: Boolean, reflect: true })
  public open = false;

  /**
   * 是否为全屏对话框
   */
  @property({ type: Boolean, reflect: true })
  public fullscreen = false;

  /**
   * 是否在按下 ESC 键时，关闭对话框
   */
  @property({ type: Boolean, reflect: true, attribute: 'close-on-esc' })
  public closeOnEsc = false;

  /**
   * 是否在点击遮罩时，关闭对话框
   */
  @property({
    type: Boolean,
    reflect: true,
    attribute: 'close-on-overlay-click',
  })
  public closeOnOverlayClick = false;

  /**
   * 是否垂直排列底部操作按钮
   */
  @property({ type: Boolean, reflect: true, attribute: 'stacked-actions' })
  public stackedActions = false;

  /**
   * 是否可拖拽移动位置
   */
  /* @property({ type: Boolean, reflect: true })
  public draggable = false; */

  /**
   * 是否可拖拽改变大小
   */
  /* @property({ type: Boolean, reflect: true })
  public resizable = false; */

  override connectedCallback() {
    super.connectedCallback();
    this.modal = new Modal(this);

    $(this).on('keydown', (event: KeyboardEvent) => {
      if (this.open && this.closeOnEsc && event.key === 'Escape') {
        event.stopPropagation();
        this.open = false;
      }
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    unlockScreen(this);
  }

  @watch('open')
  protected async onOpenChange() {
    if (this.open) {
      const requestOpen = emit(this, 'open', {
        cancelable: true,
      });
      if (requestOpen.defaultPrevented) {
        return;
      }

      // dialog 中的 mdui-top-app-bar 始终相对于 .body 元素
      if ((this.topAppBarElements ?? []).length) {
        const topAppBarElement = this.topAppBarElements![0];
        // @ts-ignore
        topAppBarElement.scrollTarget = this.body;
      }

      this.style.display = 'flex';
      this.originalTrigger = document.activeElement as HTMLElement;
      this.modal.activate();
      lockScreen(this);

      await Promise.all([
        stopAnimations(this.overlay),
        stopAnimations(this.panel),
      ]);

      // 设置聚焦
      requestAnimationFrame(() => {
        const autoFocusTarget = this.querySelector(
          '[autofocus]',
        ) as HTMLInputElement;
        if (autoFocusTarget) {
          autoFocusTarget.focus({ preventScroll: true });
        } else {
          this.panel.focus({ preventScroll: true });
        }
      });

      await Promise.all([
        animateTo(this.overlay, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 150,
          easing: EASING_LINEAR,
        }),
        animateTo(this.panel, KEYFRAME_FADE_IN, {
          duration: 150,
          easing: EASING_DECELERATION,
        }),
      ]);
      emit(this, 'opened');
    } else if (this.hasUpdated) {
      const requestClose = emit(this, 'close', {
        cancelable: true,
      });
      if (requestClose.defaultPrevented) {
        return;
      }

      this.modal.deactivate();
      await Promise.all([
        stopAnimations(this.overlay),
        stopAnimations(this.panel),
      ]);
      await Promise.all([
        animateTo(this.overlay, KEYFRAME_FADE_OUT, {
          duration: 75,
          easing: EASING_LINEAR,
        }),
        animateTo(this.panel, KEYFRAME_FADE_OUT, {
          duration: 75,
          easing: EASING_LINEAR,
        }),
      ]);
      this.style.display = 'none';
      unlockScreen(this);

      // 对话框关闭后，恢复焦点到原有的元素上
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === 'function') {
        setTimeout(() => trigger.focus());
      }

      emit(this, 'closed');
    }
  }

  protected onOverlayClick() {
    if (!this.closeOnOverlayClick) {
      return;
    }

    this.open = false;
  }

  protected renderIcon(): TemplateResult {
    return html`<div part="icon" class="icon">
      <slot name="icon">
        ${when(
          this.icon,
          () => html`<mdui-icon name=${this.icon}></mdui-icon>`,
        )}
      </slot>
    </div>`;
  }

  protected renderPrimary(): TemplateResult {
    return html`<div part="primary" class="primary">
      <slot name="primary">${this.primary}</slot>
    </div>`;
  }

  protected renderSecondary(): TemplateResult {
    return html`<div part="secondary" class="secondary">
      <slot name="secondary">${this.secondary}</slot>
    </div>`;
  }

  protected override render(): TemplateResult {
    const hasHeaderSlot = this.hasSlotController.test('header');
    const hasIconSlot = this.hasSlotController.test('icon');
    const hasPrimarySlot = this.hasSlotController.test('primary');
    const hasSecondarySlot = this.hasSlotController.test('secondary');
    const hasActionSlot = this.hasSlotController.test('action');
    const hasDefaultSlot = this.hasSlotController.test('[default]');

    const hasIcon = hasIconSlot || this.icon;
    const hasPrimary = hasPrimarySlot || this.primary;
    const hasSecondary = hasSecondarySlot || this.secondary;

    return html`<div
        part="overlay"
        class="overlay"
        @click="${this.onOverlayClick}"
        tabindex="-1"
      ></div>
      <div part="panel" class="panel" tabindex="0">
        ${when(
          hasHeaderSlot || hasIcon || hasPrimary,
          () => html`<div
            part="header"
            class="header ${classMap({ 'has-icon': hasIcon })}"
          >
            <slot name="header">
              ${when(hasIcon, () => this.renderIcon())}
              ${when(hasPrimary, () => this.renderPrimary())}
            </slot>
          </div>`,
        )}
        ${when(
          hasDefaultSlot || hasSecondary,
          () => html`<div part="body" class="body">
            ${when(hasSecondary, () => this.renderSecondary())}
            <slot></slot>
          </div>`,
        )}
        ${when(
          hasActionSlot,
          () =>
            html`<div part="actions" class="actions">
              <slot name="action"></slot>
            </div>`,
        )}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-dialog': Dialog;
  }
}

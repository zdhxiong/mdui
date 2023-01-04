import { html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/parent.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { Modal } from '@mdui/shared/helpers/modal.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { lockScreen, unlockScreen } from '@mdui/shared/helpers/scroll.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * 在手机端，modal 始终为 true；大于手机端时，modal 属性才开始生效
 *
 * @event open - 在抽屉导航打开之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉导航打开
 * @event opened - 在抽屉导航打开之后触发
 * @event close - 在抽屉导航关闭之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉导航关闭
 * @event closed - 在抽屉导航关闭之后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot - 抽屉导航中的内容
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 抽屉导航容器
 */
@customElement('mdui-navigation-drawer')
export class NavigationDrawer extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否打开抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public open = false;

  /**
   * 打开时，是否显示遮罩层
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public modal = false;

  /**
   * 在含遮罩层时，是否在按下 ESC 键时，关闭抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'close-on-esc',
  })
  public closeOnEsc = false;

  /**
   * 是否在点击遮罩时，关闭抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'close-on-overlay-click',
  })
  public closeOnOverlayClick = false;

  /**
   * 抽屉导航的显示位置。可选值为：
   * * `left`
   * * `right`
   */
  @property()
  public placement: 'left' | 'right' = 'left';

  /**
   * 默认抽屉导航相对于 body 元素显示，该参数设置为 true 时，抽屉导航将相对于它的父元素显示
   *
   * Note:
   * 设置了该属性时，必须手动在父元素上设置样式 `position: relative; box-sizing: border-box;`
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public contained = false;

  // 断点是否为手机，为 `true` 时，强制使用遮罩层
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  private handset = false;

  @query('.overlay')
  private readonly overlay!: HTMLElement;

  @query('.panel', true)
  private readonly panel!: HTMLElement;

  private resizeObserver!: ResizeObserver;
  private modalHelper!: Modal;

  // 用于在打开抽屉导航前，记录当前聚焦的元素；在关闭抽屉导航后，把焦点还原到该元素上
  private originalTrigger!: HTMLElement;

  private get lockTarget() {
    return this.contained ? this.parentElement! : document.body;
  }

  private get isModal() {
    return this.handset || this.modal;
  }

  // contained 变更后，修改监听尺寸变化的元素。为 true 时，监听父元素；为 false 时，监听 body
  @watch('contained')
  private onContainedChange() {
    if (this.hasUpdated) {
      this.resizeObserver.unobserve(
        this.contained ? document.body : this.parentElement!,
      );
    }
    this.resizeObserver.observe(
      this.contained ? this.parentElement! : document.body,
    );
  }

  @watch('open')
  private async onOpenChange() {
    const isRight = this.placement === 'right';
    const easingLinear = getEasing(this, 'linear');
    const easingEmphasized = getEasing(this, 'emphasized');

    // 打开
    // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
    if (this.open) {
      const hasUpdated = this.hasUpdated;
      if (!hasUpdated) {
        await this.updateComplete;
      }

      if (hasUpdated) {
        const requestOpen = emit(this, 'open', { cancelable: true });
        if (requestOpen.defaultPrevented) {
          return;
        }
      }

      this.style.display = this.isModal ? 'block' : 'contents';
      this.originalTrigger = document.activeElement as HTMLElement;
      if (this.isModal) {
        this.modalHelper.activate();
        lockScreen(this, this.lockTarget);
      }

      await Promise.all([
        this.isModal
          ? stopAnimations(this.overlay)
          : stopAnimations(this.lockTarget),
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

      const duration = getDuration(this, 'long2');

      await Promise.all([
        this.isModal
          ? animateTo(
              this.overlay,
              [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }],
              {
                duration: hasUpdated ? duration : 0,
                easing: easingLinear,
              },
            )
          : animateTo(
              this.lockTarget,
              [
                { [isRight ? 'paddingRight' : 'paddingLeft']: 0 },
                {
                  [isRight ? 'paddingRight' : 'paddingLeft']:
                    $(this.panel).innerWidth() + 'px',
                },
              ],
              {
                duration: hasUpdated ? duration : 0,
                easing: easingEmphasized,
                fill: 'forwards',
              },
            ),
        animateTo(
          this.panel,
          [
            { transform: isRight ? 'translateX(100%)' : 'translateX(-100%)' },
            { transform: 'translateX(0)' },
          ],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingEmphasized,
          },
        ),
      ]);

      if (hasUpdated) {
        emit(this, 'opened');
      }

      return;
    }

    // 关闭
    if (!this.open && this.hasUpdated) {
      const requestClose = emit(this, 'close', { cancelable: true });
      if (requestClose.defaultPrevented) {
        return;
      }

      if (this.isModal) {
        this.modalHelper.deactivate();
      }

      await Promise.all([
        this.isModal
          ? stopAnimations(this.overlay)
          : stopAnimations(this.lockTarget),
        stopAnimations(this.panel),
      ]);

      const duration = getDuration(this, 'short4');

      await Promise.all([
        this.isModal
          ? animateTo(this.overlay, [{ opacity: 1 }, { opacity: 0 }], {
              duration,
              easing: easingLinear,
            })
          : animateTo(
              this.lockTarget,
              [
                {
                  [isRight ? 'paddingRight' : 'paddingLeft']:
                    $(this.panel).innerWidth() + 'px',
                },
                { [isRight ? 'paddingRight' : 'paddingLeft']: 0 },
              ],
              {
                duration,
                easing: easingEmphasized,
                fill: 'forwards',
              },
            ),
        animateTo(
          this.panel,
          [
            { transform: 'translateX(0)' },
            { transform: isRight ? 'translateX(100%)' : 'translateX(-100%)' },
          ],
          { duration, easing: easingEmphasized },
        ),
      ]);
      this.style.display = 'none';

      if (this.isModal) {
        unlockScreen(this, this.lockTarget);
      }

      // 抽屉导航关闭后，恢复焦点到原有的元素上
      const trigger = this.originalTrigger;
      if (typeof trigger?.focus === 'function') {
        setTimeout(() => trigger.focus());
      }

      emit(this, 'closed');
      return;
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.modalHelper = new Modal(this);

    // 监听窗口尺寸变化，重新设置 handset 属性
    this.resizeObserver = new ResizeObserver(() => this.setHandset());

    $(this).on('keydown', (event: KeyboardEvent) => {
      if (
        this.open &&
        this.closeOnEsc &&
        event.key === 'Escape' &&
        this.isModal
      ) {
        event.stopPropagation();
        this.open = false;
      }
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    unlockScreen(this, this.lockTarget);
  }

  protected override render(): TemplateResult {
    return html`${when(
        this.isModal,
        () => html`<div
          part="overlay"
          class="overlay"
          @click=${this.onOverlayClick}
        ></div>`,
      )}
      <div part="panel" class="panel" tabindex="0"><slot></slot></div>`;
  }

  /**
   * 重新计算并设置 handset 属性
   */
  private setHandset() {
    // 根元素参考值
    const baseFontSize = parseFloat($('html').css('font-size'));
    // 手机端断点值，单位可能为 px 或 rem
    const breakpointHandset = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--mdui-breakpoint-handset')
      .toLowerCase();

    const containerWidth = this.contained
      ? $(this).parent().innerWidth()
      : $(window).innerWidth();

    this.handset = breakpointHandset.endsWith('rem')
      ? containerWidth < parseFloat(breakpointHandset) * baseFontSize
      : containerWidth < parseFloat(breakpointHandset);
  }

  private onOverlayClick() {
    emit(this, 'overlay-click');
    if (!this.closeOnOverlayClick) {
      return;
    }

    this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-drawer': NavigationDrawer;
  }
}

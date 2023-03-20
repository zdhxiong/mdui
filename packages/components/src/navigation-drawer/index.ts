import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { isNull } from '@mdui/jq/shared/helper.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { getBreakpoint } from '@mdui/shared/helpers/breakpoint.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { Modal } from '@mdui/shared/helpers/modal.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { lockScreen, unlockScreen } from '@mdui/shared/helpers/scroll.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { style } from './style.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

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
export class NavigationDrawer extends LayoutItemBase {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否打开抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public open = false;

  /**
   * 打开时，是否显示遮罩层
   * 在断点为 `handset` 时，会无视该参数，始终显示遮罩层
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public modal = false;

  /**
   * 在含遮罩层时，是否在按下 ESC 键时，关闭抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
    attribute: 'close-on-esc',
  })
  public closeOnEsc = false;

  /**
   * 是否在点击遮罩时，关闭抽屉导航
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
    attribute: 'close-on-overlay-click',
  })
  public closeOnOverlayClick = false;

  /**
   * 抽屉导航的显示位置。可选值为：
   * * `left`
   * * `right`
   */
  @property({ reflect: true })
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
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public contained = false;

  // 断点是否为手机，为 `true` 时，强制使用遮罩层
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  private handset = false;

  // 用于在打开抽屉导航前，记录当前聚焦的元素；在关闭抽屉导航后，把焦点还原到该元素上
  private originalTrigger!: HTMLElement;

  private observeResize?: ObserveResize;
  private modalHelper!: Modal;
  private readonly overlayRef: Ref<HTMLElement> = createRef();
  private readonly panelRef: Ref<HTMLElement> = createRef();

  protected override get layoutPlacement(): LayoutPlacement {
    return this.placement;
  }

  private get lockTarget() {
    return this.contained || this.isParentLayout
      ? this.parentElement!
      : document.body;
  }

  private get isModal() {
    return this.handset || this.modal;
  }

  // contained 变更后，修改监听尺寸变化的元素。为 true 时，监听父元素；为 false 时，监听 body
  @watch('contained')
  private onContainedChange() {
    if (this.hasUpdated) {
      this.observeResize?.unobserve();
    }

    this.observeResize = observeResize(
      this.contained ? this.parentElement! : document.body,
      () => {
        const target = this.contained ? this.parentElement! : undefined;
        this.handset = getBreakpoint(target) === 'handset';

        // 若位于 layout 中，且为模态化，则重新布局时，占据的宽度为 0
        if (this.isParentLayout) {
          this.layoutManager!.updateLayout(this, {
            width: this.isModal ? 0 : undefined,
          });
        }
      },
    );
  }

  @watch('placement')
  private onPlacementChange() {
    if (this.isParentLayout) {
      this.layoutManager!.updateLayout(this);
    }
  }

  @watch('open')
  private async onOpenChange() {
    let panel = this.panelRef.value!;
    let overlay = this.overlayRef.value!;
    const isRight = this.placement === 'right';
    const paddingPropName = isRight ? 'paddingRight' : 'paddingLeft';
    const easingLinear = getEasing(this, 'linear');
    const easingEmphasized = getEasing(this, 'emphasized');

    // 在当前 drawer 位于 layout 中时，设置所有 layout-item 和 layout-main 元素的 transition 样式
    const setLayoutTransition = (duration: number | null, easing?: string) => {
      $(this.layoutManager!.getItemsAndMain()).css(
        'transition',
        isNull(duration) ? null : `all ${duration}ms ${easing}`,
      );
    };

    // 停止原有动画
    const stopOldAnimations = async () => {
      await Promise.all([
        this.isModal
          ? stopAnimations(overlay)
          : !this.isParentLayout
          ? stopAnimations(this.lockTarget)
          : Promise.resolve(),
        this.isModal ? stopAnimations(panel) : stopAnimations(this),
      ]);
    };

    // 打开
    // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
    if (this.open) {
      const hasUpdated = this.hasUpdated;
      if (!hasUpdated) {
        await this.updateComplete;
        panel = this.panelRef.value!;
        overlay = this.overlayRef.value!;
      }

      if (hasUpdated) {
        const requestOpen = emit(this, 'open', { cancelable: true });
        if (requestOpen.defaultPrevented) {
          return;
        }
      }

      // todo 为模态化时，不参与 layout 布局

      this.style.display = 'block';
      this.originalTrigger = document.activeElement as HTMLElement;
      if (this.isModal) {
        this.modalHelper.activate();
        lockScreen(this, this.lockTarget);
      }

      await stopOldAnimations();

      // 设置聚焦
      requestAnimationFrame(() => {
        const autoFocusTarget = this.querySelector(
          '[autofocus]',
        ) as HTMLInputElement;
        if (autoFocusTarget) {
          autoFocusTarget.focus({ preventScroll: true });
        } else {
          panel.focus({ preventScroll: true });
        }
      });

      const duration = getDuration(this, 'long2');
      const animations = [];

      // 模态框 drawer，显示 overlay 动画
      if (this.isModal) {
        animations.push(
          animateTo(
            overlay,
            [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }],
            {
              duration: hasUpdated ? duration : 0,
              easing: easingLinear,
            },
          ),
        );
      }
      // 不位于 layout 中，父元素 padding 变化的动画
      else if (!this.isParentLayout) {
        animations.push(
          animateTo(
            this.lockTarget,
            [
              { [paddingPropName]: 0 },
              { [paddingPropName]: $(panel).innerWidth() + 'px' },
            ],
            {
              duration: hasUpdated ? duration : 0,
              easing: easingEmphasized,
              fill: 'forwards',
            },
          ),
        );
      }

      // 若位于 layout 中，则 layout-main 的 padding 变化需要有和 drawer 相同的动画
      // 但首次渲染不执行动画
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(duration, easingEmphasized);
      }

      // drawer 显示动画
      animations.push(
        animateTo(
          this.isModal ? panel : this,
          [
            { transform: `translateX(${isRight ? '' : '-'}100%)` },
            { transform: 'translateX(0)' },
          ],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingEmphasized,
          },
        ),
      );

      await Promise.all(animations);

      // 若位于 layout 中，则 drawer 动画完成后，移除 layout-main 的动画
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(null);
      }

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

      await stopOldAnimations();

      const duration = getDuration(this, 'short4');
      const animations = [];

      // 模态框 drawer，显示 overlay 动画
      if (this.isModal) {
        animations.push(
          animateTo(overlay, [{ opacity: 1 }, { opacity: 0 }], {
            duration,
            easing: easingLinear,
          }),
        );
      }

      // 不位于 layout 中，父元素 padding 变化的动画
      else if (!this.isParentLayout) {
        animations.push(
          animateTo(
            this.lockTarget,
            [
              { [paddingPropName]: $(panel).innerWidth() + 'px' },
              { [paddingPropName]: 0 },
            ],
            {
              duration,
              easing: easingEmphasized,
              fill: 'forwards',
            },
          ),
        );
      }

      // 若位于 layout 中，则 layout-main 的 padding 变化需要有和 drawer 相同的动画
      if (this.isParentLayout) {
        setLayoutTransition(duration, easingEmphasized);

        // 关闭动画开始时，drawer 的宽度不变。等到关闭动画结束，drawer 的宽度才变为 0
        // 为了 layout-main 的动画能在关闭动画开始时就执行，强制调用 updateLayout 更新布局
        this.layoutManager!.updateLayout(this, { width: 0 });
      }

      // drawer 显示动画
      animations.push(
        animateTo(
          this.isModal ? panel : this,
          [
            { transform: 'translateX(0)' },
            { transform: `translateX(${isRight ? '' : '-'}100%)` },
          ],
          { duration, easing: easingEmphasized },
        ),
      );

      await Promise.all(animations);

      // 若位于 layout 中，则 drawer 动画结束后，移除 layout-main 的动画
      if (this.isParentLayout) {
        setLayoutTransition(null);
      }

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

    this.addEventListener('keydown', (event: KeyboardEvent) => {
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
    this.observeResize?.unobserve();
  }

  protected override render(): TemplateResult {
    return html`${when(
        this.isModal,
        () => html`<div
          ${ref(this.overlayRef)}
          part="overlay"
          class="overlay"
          @click=${this.onOverlayClick}
        ></div>`,
      )}
      <div ${ref(this.panelRef)} part="panel" class="panel" tabindex="0">
        <slot></slot>
      </div>`;
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

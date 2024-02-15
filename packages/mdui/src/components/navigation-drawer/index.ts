import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { isFunction, isNull } from '@mdui/jq/shared/helper.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { breakpoint } from '@mdui/shared/helpers/breakpoint.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { Modal } from '@mdui/shared/helpers/modal.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { lockScreen, unlockScreen } from '@mdui/shared/helpers/scroll.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { style } from './style.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ObserveResize } from '@mdui/shared/helpers/observeResize.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * 在手机端，`modal` 始终为 `true`；大于手机端时，`modal` 属性才开始生效
 *
 * @summary 侧边抽屉栏组件
 *
 * ```html
 * <mdui-navigation-drawer>content</mdui-navigation-drawer>
 * ```
 *
 * @event open - 抽屉栏打开之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉栏打开
 * @event opened - 抽屉栏打开动画完成之后触发
 * @event close - 抽屉栏关闭之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉栏关闭
 * @event closed - 抽屉栏关闭动画完成之后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot - 抽屉栏中的内容
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 抽屉栏容器
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
@customElement('mdui-navigation-drawer')
export class NavigationDrawer extends LayoutItemBase<NavigationDrawerEventMap> {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * 是否打开抽屉栏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public open = false;

  /**
   * 抽屉栏打开时，是否显示遮罩层
   *
   * 在窄屏设备上（屏幕宽度小于 [`--mdui-breakpoint-md`](/docs/2/styles/design-tokens#breakpoint)），会始终显示遮罩层，无视该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public modal = false;

  /**
   * 在有遮罩层的情况下，按下 ESC 键是否关闭抽屉栏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'close-on-esc',
  })
  public closeOnEsc = false;

  /**
   * 点击遮罩层时，是否关闭抽屉栏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'close-on-overlay-click',
  })
  public closeOnOverlayClick = false;

  /**
   * 抽屉栏的位置。可选值包括：
   *
   * * `left`：左侧
   * * `right`：右侧
   */
  @property({ reflect: true })
  // eslint-disable-next-line prettier/prettier
  public placement:
    | /*左侧*/ 'left'
    | /*右侧*/ 'right' = 'left';

  /**
   * 默认情况下，抽屉栏相对于 `body` 元素显示。当该参数设置为 `true` 时，抽屉栏将相对于其父元素显示。
   *
   * **Note**：设置该属性时，必须在父元素上手动设置样式 `position: relative; overflow: hidden;`。
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public contained = false;

  // 断点为 mobile 时为 `true` 时，强制使用遮罩层
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private mobile = false;

  // 用于在打开抽屉栏前，记录当前聚焦的元素；在关闭抽屉栏后，把焦点还原到该元素上
  private originalTrigger!: HTMLElement;

  private observeResize?: ObserveResize;
  private modalHelper!: Modal;
  private readonly overlayRef: Ref<HTMLElement> = createRef();
  private readonly panelRef: Ref<HTMLElement> = createRef();
  private readonly definedController = new DefinedController(this, {
    needDomReady: true,
  });

  protected override get layoutPlacement(): LayoutPlacement {
    return this.placement;
  }

  private get lockTarget() {
    return this.contained || this.isParentLayout
      ? this.parentElement!
      : document.documentElement;
  }

  private get isModal() {
    return this.mobile || this.modal;
  }

  // contained 变更后，修改监听尺寸变化的元素。为 true 时，监听父元素；为 false 时，监听 body
  @watch('contained')
  private async onContainedChange() {
    await this.definedController.whenDefined();

    this.observeResize?.unobserve();

    this.observeResize = observeResize(
      this.contained ? this.parentElement! : document.documentElement,
      () => {
        const target = this.contained ? this.parentElement! : undefined;
        this.mobile = breakpoint(target).down('md');

        // 若位于 layout 中，且为模态化，则重新布局时，占据的宽度为 0
        if (this.isParentLayout) {
          this.layoutManager!.updateLayout(this, {
            width: this.isModal ? 0 : undefined,
          });
        }
      },
    );
  }

  @watch('placement', true)
  private onPlacementChange() {
    if (this.isParentLayout) {
      this.layoutManager!.updateLayout(this);
    }
  }

  @watch('mobile', true)
  @watch('modal', true)
  private async onMobileChange() {
    if (!this.open || this.isParentLayout || this.contained) {
      return;
    }

    await this.definedController.whenDefined();

    if (this.isModal) {
      lockScreen(this, this.lockTarget);
      await this.getLockTargetAnimate(false, 0);
    } else {
      unlockScreen(this, this.lockTarget);
      await this.getLockTargetAnimate(true, 0);
    }
  }

  @watch('open')
  private async onOpenChange() {
    let panel = this.panelRef.value!;
    let overlay = this.overlayRef.value!;
    const isRight = this.placement === 'right';
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
      const elements = [];

      if (this.isModal) {
        elements.push(overlay, panel);
      } else if (!this.isParentLayout) {
        elements.push(this.lockTarget);
      }

      if (this.isParentLayout) {
        const layoutItems = this.layoutManager!.getItemsAndMain();
        const layoutIndex = layoutItems.indexOf(this);
        elements.push(...layoutItems.slice(layoutIndex));
      }

      if (!this.isModal && !elements.includes(this)) {
        elements.push(this);
      }

      await Promise.all(elements.map((element) => stopAnimations(element)));
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
        const eventProceeded = this.emit('open', { cancelable: true });
        if (!eventProceeded) {
          return;
        }
      }

      await this.definedController.whenDefined();

      this.style.display = 'block';
      this.originalTrigger = document.activeElement as HTMLElement;
      if (this.isModal) {
        this.modalHelper.activate();
        if (!this.contained) {
          lockScreen(this, this.lockTarget);
        }
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
          this.getLockTargetAnimate(true, hasUpdated ? duration : 0),
        );
      }

      // 若位于 layout 中，则 layout-main 的 padding 变化需要有和 drawer 相同的动画
      // 但首次渲染不执行动画
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(duration, easingEmphasized);

        this.layoutManager!.updateLayout(this);
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

      if (!this.open) {
        return;
      }

      // 若位于 layout 中，则 drawer 动画完成后，移除 layout-main 的动画
      if (this.isParentLayout && hasUpdated) {
        setLayoutTransition(null);
      }

      if (hasUpdated) {
        this.emit('opened');
      }
    } else if (this.hasUpdated) {
      // 关闭
      const eventProceeded = this.emit('close', { cancelable: true });
      if (!eventProceeded) {
        return;
      }

      await this.definedController.whenDefined();

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
        animations.push(this.getLockTargetAnimate(false, duration));
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

      if (this.open) {
        return;
      }

      // 若位于 layout 中，则 drawer 动画结束后，移除 layout-main 的动画
      if (this.isParentLayout) {
        setLayoutTransition(null);
      }

      this.style.display = 'none';

      if (this.isModal && !this.contained) {
        unlockScreen(this, this.lockTarget);
      }

      // 抽屉栏关闭后，恢复焦点到原有的元素上
      const trigger = this.originalTrigger;
      if (isFunction(trigger?.focus)) {
        setTimeout(() => trigger.focus());
      }

      this.emit('closed');
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.modalHelper = new Modal(this);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    unlockScreen(this, this.lockTarget);
    this.observeResize?.unobserve();
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

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

  protected override render(): TemplateResult {
    return html`${when(
        this.isModal,
        () =>
          html`<div
            ${ref(this.overlayRef)}
            part="overlay"
            class="overlay"
            @click=${this.onOverlayClick}
          ></div>`,
      )}
      <slot
        ${ref(this.panelRef)}
        part="panel"
        class="panel"
        tabindex="0"
      ></slot>`;
  }

  private onOverlayClick() {
    this.emit('overlay-click');

    if (this.closeOnOverlayClick) {
      this.open = false;
    }
  }

  private getLockTargetAnimate(open: boolean, duration: number) {
    const paddingName =
      this.placement === 'right' ? 'paddingRight' : 'paddingLeft';
    const panelWidth = $(this.panelRef.value!).innerWidth() + 'px';

    return animateTo(
      this.lockTarget,
      [
        { [paddingName]: open ? 0 : panelWidth },
        { [paddingName]: open ? panelWidth : 0 },
      ],
      {
        duration,
        easing: getEasing(this, 'emphasized'),
        fill: 'forwards',
      },
    );
  }
}

export interface NavigationDrawerEventMap {
  open: CustomEvent<void>;
  opened: CustomEvent<void>;
  close: CustomEvent<void>;
  closed: CustomEvent<void>;
  'overlay-click': CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-navigation-drawer': NavigationDrawer;
  }
}

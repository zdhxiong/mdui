import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { topAppBarStyle } from './top-app-bar-style.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ScrollPaddingPosition } from '@mdui/shared/mixins/scrollBehavior.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

type TopAppBarTitle = {
  variant: 'center-aligned' | 'small' | 'medium' | 'large';
  shrink: boolean;
};

/**
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 顶部应用栏内部的元素
 *
 * @csspart large-title - `variant="medium"` 和 `variant="large"` 时，展开的大标题
 * @csspart large-title-inner - `variant="medium"` 和 `variant="large"` 时，展开的大标题的内部元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
@customElement('mdui-top-app-bar')
export class TopAppBar extends ScrollBehaviorMixin(LayoutItemBase) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    topAppBarStyle,
  ];

  /**
   * 顶部应用栏形状。可选值为：
   * * `center-aligned`
   * * `small`
   * * `medium`
   * * `large`
   */
  @property({ reflect: true })
  public variant:
    | 'center-aligned' /*预览图*/
    | 'small' /*预览图*/
    | 'medium' /*预览图*/
    | 'large' /*预览图*/ = 'small';

  /**
   * 是否隐藏
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public hide = false;

  /**
   * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public shrink = false;

  /**
   * 滚动行为。可同时使用多个值，多个值之间用空格分割。可选值为：
   * * `hide`：滚动时隐藏
   * * `shrink`：滚动时缩小成 `variant="small"` 的样式
   * * `elevate`：滚动时添加阴影
   */
  @property({ reflect: true, attribute: 'scroll-behavior' })
  public scrollBehavior?:
    | 'hide' /*滚动时隐藏*/
    | 'shrink' /*滚动时缩小成 `variant="small"` 的样式*/
    | 'elevate' /*滚动时添加阴影*/;

  /**
   * 滚动条是否不位于顶部
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  private scrolling = false;

  @queryAssignedElements({ selector: 'mdui-top-app-bar-title', flatten: true })
  private readonly titleElements!: TopAppBarTitle[];

  protected get scrollPaddingPosition(): ScrollPaddingPosition {
    return 'top';
  }

  protected override get layoutPlacement(): LayoutPlacement {
    return 'top';
  }

  @watch('variant')
  private async onVariantChange() {
    if (this.hasUpdated) {
      // variant 变更时，重新为 scrollTargetContainer 元素添加 padding-top。避免 top-app-bar 覆盖内容
      this.addEventListener(
        'transitionend',
        () => {
          this.updateContainerPadding();
        },
        { once: true },
      );
    } else {
      await this.updateComplete;
    }

    this.titleElements.forEach((titleElement) => {
      titleElement.variant = this.variant;
    });
  }

  @watch('shrink')
  private async onShrinkChange() {
    if (!this.hasUpdated) {
      await this.updateComplete;
    }
    this.titleElements.forEach((titleElement) => {
      titleElement.shrink = this.shrink;
    });
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('transitionend', (e: TransitionEvent) => {
      if (e.target === this) {
        emit(this, this.hide ? 'hidden' : 'shown');
      }
    });
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected runScrollNoThreshold(isScrollingUp: boolean, scrollTop: number) {
    // 向上滚动到顶部时，复原（无视 scrollThreshold 属性，否则会无法复原）
    if (this.hasScrollBehavior('shrink')) {
      // 到距离顶部 8px 即开始复原，显得灵敏些
      if (isScrollingUp && scrollTop < 8) {
        this.shrink = false;
      }
    }
  }

  protected runScrollThreshold(isScrollingUp: boolean, scrollTop: number) {
    // 滚动时添加阴影
    if (this.hasScrollBehavior('elevate')) {
      this.scrolling = !!scrollTop;
    }

    // 向下滚动时，缩小
    if (this.hasScrollBehavior('shrink')) {
      if (!isScrollingUp) {
        this.shrink = true;
      }
    }

    // 滚动时隐藏
    if (this.hasScrollBehavior('hide')) {
      // 向下滚动
      if (!isScrollingUp && !this.hide) {
        const requestHide = emit(this, 'hide');
        if (!requestHide.defaultPrevented) {
          this.hide = true;
        }
      }

      // 向上滚动
      if (isScrollingUp && this.hide) {
        const requestShow = emit(this, 'show');
        if (!requestShow.defaultPrevented) {
          this.hide = false;
        }
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar': TopAppBar;
  }
}

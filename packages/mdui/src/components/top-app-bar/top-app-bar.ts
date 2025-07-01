import { html } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { topAppBarStyle } from './top-app-bar-style.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ScrollPaddingPosition } from '@mdui/shared/mixins/scrollBehavior.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

type TopAppBarTitle = {
  variant: 'center-aligned' | 'small' | 'medium' | 'large';
  shrink: boolean;
};

/**
 * @summary 顶部应用栏组件
 *
 * ```html
 * <mdui-top-app-bar>
 * ..<mdui-button-icon icon="menu"></mdui-button-icon>
 * ..<mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-button-icon icon="more_vert"></mdui-button-icon>
 * </mdui-top-app-bar>
 * ```
 *
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 顶部应用栏内部的元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
@customElement('mdui-top-app-bar')
export class TopAppBar extends ScrollBehaviorMixin(
  LayoutItemBase,
)<TopAppBarEventMap> {
  public static override styles: CSSResultGroup = [
    componentStyle,
    topAppBarStyle,
  ];

  /**
   * 顶部应用栏的形状。默认为 `small`。可选值包括：
   *
   * * `center-aligned`：小型应用栏，标题居中
   * * `small`：小型应用栏
   * * `medium`：中型应用栏
   * * `large`：大型应用栏
   */
  @property({ reflect: true })
  public variant:
    | /*小型应用栏，标题居中*/ 'center-aligned'
    | /*小型应用栏*/ 'small'
    | /*中型应用栏*/ 'medium'
    | /*大型应用栏*/ 'large' = 'small';

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
   * 是否缩小为 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public shrink = false;

  /**
   * 滚动行为。可同时使用多个值，用空格分隔。可选值包括：
   *
   * * `hide`：滚动时隐藏
   * * `shrink`：在中型、大型应用栏中可使用，滚动时缩小成小型应用栏的样式
   * * `elevate`：滚动时添加阴影
   */
  @property({ reflect: true, attribute: 'scroll-behavior' })
  public scrollBehavior?:
    | /*滚动时隐藏*/ 'hide'
    | /*在中型、大型应用栏中可使用，滚动时缩小成小型应用栏的样式*/ 'shrink'
    | /*滚动时添加阴影*/ 'elevate';

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

  private definedController = new DefinedController(this, {
    relatedElements: ['mdui-top-app-bar-title'],
  });

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
        async () => {
          await this.scrollBehaviorDefinedController.whenDefined();
          this.setContainerPadding('update', this.scrollTarget);
        },
        { once: true },
      );
    } else {
      await this.updateComplete;
    }

    await this.definedController.whenDefined();
    this.titleElements.forEach((titleElement) => {
      titleElement.variant = this.variant;
    });
  }

  @watch('shrink')
  private async onShrinkChange() {
    if (!this.hasUpdated) {
      await this.updateComplete;
    }

    await this.definedController.whenDefined();
    this.titleElements.forEach((titleElement) => {
      titleElement.shrink = this.shrink;
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this.addEventListener('transitionend', (e: TransitionEvent) => {
      if (e.target === this) {
        this.emit(this.hide ? 'hidden' : 'shown');
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
        const eventProceeded = this.emit('hide', { cancelable: true });
        if (eventProceeded) {
          this.hide = true;
        }
      }

      // 向上滚动
      if (isScrollingUp && this.hide) {
        const eventProceeded = this.emit('show', { cancelable: true });
        if (eventProceeded) {
          this.hide = false;
        }
      }
    }
  }
}

export interface TopAppBarEventMap {
  show: CustomEvent<void>;
  shown: CustomEvent<void>;
  hide: CustomEvent<void>;
  hidden: CustomEvent<void>;
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-top-app-bar': TopAppBar;
  }
}

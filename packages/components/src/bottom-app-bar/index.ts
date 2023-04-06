import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { style } from './style.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ScrollPaddingPosition } from '@mdui/shared/mixins/scrollBehavior.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 底部应用栏内部的元素
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-bottom-app-bar')
export class BottomAppBar extends ScrollBehaviorMixin(LayoutItemBase) {
  public static override styles: CSSResultGroup = [componentStyle, style];

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
   * 是否使底部应用栏中的 `<mdui-fab>` 组件脱离应用栏。若为 `true`，则在应用栏隐藏后，`<mdui-fab>` 仍将停留在页面上
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'fab-detach',
  })
  public fabDetach = false;

  /**
   * 滚动行为。可选值为：
   * * `hide`：滚动时隐藏
   */
  @property({ reflect: true, attribute: 'scroll-behavior' })
  public scrollBehavior?: 'hide' /*滚动时隐藏*/;

  protected get scrollPaddingPosition(): ScrollPaddingPosition {
    return 'bottom';
  }

  protected override get layoutPlacement(): LayoutPlacement {
    return 'bottom';
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('transitionend', (event: TransitionEvent) => {
      if (event.target === this) {
        emit(this, this.hide ? 'hidden' : 'shown');
      }
    });
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * 滚动行为
   * 当前仅支持 hide 这一个行为，所以不做行为类型判断
   */
  protected runScrollThreshold(isScrollingUp: boolean) {
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

declare global {
  interface HTMLElementTagNameMap {
    'mdui-bottom-app-bar': BottomAppBar;
  }
}

import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/width.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

/**
 * @event open - dropdown 开始打开时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 dropdown 打开
 * @event opened - dropdown 打开动画完成时，事件被触发
 * @event close - dropdown 开始关闭时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 dropdown 关闭
 * @event closed - dropdown 关闭动画完成时，事件被触发
 *
 * @slot - dropdown 的内容
 * @slot trigger - 触发 dropdown 的元素，例如 `<mdui-button>` 元素
 *
 * @csspart trigger - `trigger` slot 的容器
 * @csspart panel - dropdown 内容的容器
 */
@customElement('mdui-dropdown')
export class Dropdown extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  @queryAssignedElements({ slot: 'trigger', flatten: true })
  protected triggerSlots!: HTMLElement[];

  protected get triggerSlot(): HTMLElement {
    return this.triggerSlots[0];
  }

  @queryAssignedElements({ flatten: true })
  protected panelSlots!: HTMLElement[];

  protected get panelSlot(): HTMLElement {
    return this.panelSlots[0];
  }

  private resizeObserver!: ResizeObserver;

  @query('.panel')
  protected panel!: HTMLElement;

  /**
   * dropdown 是否打开
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public open = false;

  /**
   * 是否禁用 dropdown
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public disabled = false;

  /**
   * dropdown 的触发方式，支持传入多个值，用空格分隔。可选值为：
   * * `click`：点击时触发
   * * `hover`：鼠标悬浮触发
   * * `focus`：聚焦时触发
   * * `contextmenu`：鼠标右键点击、或触摸长按时触发
   * * `manual`：使用了该值时，只能使用编程方式打开和关闭 dropdown，且不能再指定其他触发方式
   */
  @property({ reflect: true })
  public trigger:
    | 'click' /*点击时触发*/
    | 'hover' /*鼠标悬浮触发*/
    | 'focus' /*聚焦时触发*/
    | 'contextmenu' /*鼠标右键点击、或触摸长按时触发*/
    | 'manual' /*通过编程方式触发*/
    | 'click hover'
    | 'click focus'
    | 'click contextmenu'
    | 'hover focus'
    | 'hover contextmenu'
    | 'focus contextmenu'
    | 'click hover focus'
    | 'click hover contextmenu'
    | 'click focus contextmenu'
    | 'hover focus contextmenu'
    | 'click hover focus contextmenu' = 'click';

  /**
   * dropdown 内容的方位。可选值为：
   * * `auto`：自动判断方位
   * * `bottom-start`：位于下方，且左对齐
   * * `bottom-end`：位于下方，且右对齐
   * * `top-start`：位于上方，且左对齐
   * * `top-end`：位于上方，且右对齐
   */
  @property({ reflect: true })
  public placement:
    | 'auto' /*自动判断方位*/
    | 'bottom-start' /*位于下方，且左对齐*/
    | 'bottom-end' /*位于下方，且右对齐*/
    | 'top-start' /*位于上方，且左对齐*/
    | 'top-end' /*位于上方，且右对齐*/ = 'auto';

  /**
   * 在点击 `<mdui-menu-item>` 元素后，是否仍保持 dropdown 为打开状态
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'stay-open-on-click',
  })
  public stayOpenOnClick = false;

  /**
   * 通过 hover 触发 dropdown 打开时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'open-delay' })
  public openDelay = 150;

  /**
   * 通过 hover 触发 dropdown 关闭时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'close-delay' })
  public closeDelay = 150;

  /**
   * 是否在触发 dropdown 时的光标所在的位置打开 dropdown。通常用于在打开鼠标右键菜单时使用
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'open-on-pointer',
  })
  public openOnPointer = false;

  /**
   * dropdown 下拉内容的 zIndex 的值
   */
  @property({ type: Number, reflect: true, attribute: 'z-index' })
  public zIndex = 900;

  /**
   * 在 document 上点击时，根据条件判断是否要关闭 dropdown
   */
  protected onDocumentClick(e: MouseEvent) {
    if (!this.open) {
      return;
    }

    const path = e.composedPath();

    // 点击 dropdown 外部区域，直接关闭
    if (!path.includes(this)) {
      this.open = false;
    }

    // 当包含 contextmenu 且不包含 click 时，点击 trigger，关闭
    if (
      this.hasTrigger('contextmenu') &&
      !this.hasTrigger('click') &&
      path.includes(this.triggerSlot)
    ) {
      this.open = false;
    }
  }

  /**
   * 在 document 上按下按键时，根据条件判断是否要关闭 dropdown
   */
  protected onDocumentKeydown(event: KeyboardEvent) {
    if (!this.open) {
      return;
    }

    // 按下 ESC 键时，关闭 dropdown
    if (event.key === 'Escape') {
      this.open = false;
      return;
    }

    // 按下 Tab 键时，关闭 dropdown
    if (event.key === 'Tab') {
      // 如果不支持 focus 触发，则焦点回到 trigger 上（这个会在 onOpenChange 中执行 ）这里只需阻止默认的 Tab 行为
      if (
        !this.hasTrigger('focus') &&
        typeof this.triggerSlot?.focus === 'function'
      ) {
        event.preventDefault();
      }

      this.open = false;
    }
  }

  override async connectedCallback() {
    super.connectedCallback();

    $(document).on('pointerdown._dropdown', (e) =>
      this.onDocumentClick(e as MouseEvent),
    );
    $(document).on('keydown._dropdown', (e) =>
      this.onDocumentKeydown(e as KeyboardEvent),
    );
    $(window).on('scroll._dropdown', () => {
      window.requestAnimationFrame(() => this.onPositionChange());
    });

    // triggerSlot 的尺寸变化时，重新调整 panel 的位置
    this.resizeObserver = new ResizeObserver(() => {
      this.updatePositioner();
    });
    await this.updateComplete;
    this.resizeObserver.observe(this.triggerSlot);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    $(document).off('pointerdown._dropdown');
    $(document).off('keydown._dropdown');
    $(window).off('scroll._dropdown');

    this.resizeObserver.unobserve(this.triggerSlot);
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    $(this).on('mouseleave._dropdown', () => this.onMouseLeave());

    $(this.triggerSlot).on({
      focus: () => this.onFocus(),
      click: (e) => this.onClick(e as MouseEvent),
      contextmenu: (e) => this.onContextMenu(e as MouseEvent),
      mouseenter: () => this.onMouseEnter(),
    });

    $(this.panel).on({
      click: (e) => this.onPanelClick(e as MouseEvent),
    });

    this.panel.hidden = !this.open || this.disabled;
  }

  protected hasTrigger(
    trigger: 'click' | 'hover' | 'focus' | 'contextmenu' | 'manual',
  ): boolean {
    const triggers = this.trigger.split(' ');
    return triggers.includes(trigger);
  }

  protected onFocus() {
    if (this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = true;
  }

  // 右键菜单点击位置相对于 trigger 的位置
  private pointerOffsetX!: number;
  private pointerOffsetY!: number;

  protected onClick(e: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (e.button || !this.hasTrigger('click')) {
      return;
    }

    this.pointerOffsetX = e.offsetX;
    this.pointerOffsetY = e.offsetY;

    this.open = !this.open;
  }

  protected onPanelClick(event: MouseEvent) {
    if (!this.stayOpenOnClick && $(event.target!).is('mdui-menu-item')) {
      this.open = false;
    }
  }

  protected onContextMenu(e: MouseEvent) {
    if (!this.hasTrigger('contextmenu')) {
      return;
    }

    e.preventDefault();
    this.pointerOffsetX = e.offsetX;
    this.pointerOffsetY = e.offsetY;
    this.open = true;
  }

  private openTimeout!: number;
  private closeTimeout!: number;

  protected onMouseEnter() {
    // 不做 open 状态的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover')) {
      return;
    }

    window.clearTimeout(this.closeTimeout);
    if (this.openDelay) {
      this.openTimeout = window.setTimeout(() => {
        this.open = true;
      }, this.openDelay);
    } else {
      this.open = true;
    }
  }

  protected onMouseLeave() {
    // 不做 open 状态的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover')) {
      return;
    }

    window.clearTimeout(this.openTimeout);
    this.closeTimeout = window.setTimeout(() => {
      this.open = false;
    }, this.closeDelay || 50);
  }

  protected updatePositioner(): void {
    const $panel = $(this.panel);
    const $window = $(window);
    const triggerRect = this.triggerSlot.getBoundingClientRect();
    const panelRect = {
      width: Math.max(
        ...(this.panelSlots?.map((panel) => panel.offsetWidth) ?? []),
      ),
      height: this.panelSlots
        ?.map((panel) => panel.offsetHeight)
        .reduce((total, height) => total + height),
    };
    // dropdown 与屏幕边界至少保留 8px 间距
    const screenMargin = 8;

    // 指定了 openOnPointer，则在光标位置打开 dropdown
    // 始终在光标右侧打开，若光标右侧空间不足，则显示在屏幕最右侧
    // 优先在光标下侧打开；若光标下侧空间不足，则在上侧打开；若上侧空间也不足，则位于屏幕顶部打开
    if (this.openOnPointer) {
      let left: number;
      let top: number;
      let transformOriginX: 'left' | 'right';
      let transformOriginY: 'top' | 'bottom';
      if (
        $window.width() - triggerRect.left - this.pointerOffsetX >
        panelRect.width + screenMargin
      ) {
        // 右侧放得下
        left = triggerRect.left + this.pointerOffsetX;
        transformOriginX = 'left';
      } else {
        // 右侧放不下时，放左侧
        left = $window.width() - panelRect.width - screenMargin;
        transformOriginX = 'right';
      }

      if (
        $window.height() - triggerRect.top - this.pointerOffsetY >
        panelRect.height + screenMargin
      ) {
        // 下方放得下
        top = triggerRect.top + this.pointerOffsetY;
        transformOriginY = 'top';
      } else if (
        triggerRect.top + this.pointerOffsetY >
        panelRect.height + screenMargin
      ) {
        // 上方放得下
        top = triggerRect.top + this.pointerOffsetY - panelRect.height;
        transformOriginY = 'bottom';
      } else {
        // 上方、下方都放不下，放在屏幕顶部
        top = screenMargin;
        transformOriginY = 'top';
      }

      $panel.css({
        left,
        top,
        transformOrigin: [transformOriginX, transformOriginY].join(' '),
      });
      return;
    }

    // 未指定 openOnPointer，则根据 placement 参数设置打开方位
    let transformOriginX: 'left' | 'right';
    let transformOriginY: 'top' | 'bottom';

    // 自动判断 dropdown 的方位
    if (this.placement === 'auto') {
      if (
        $window.height() - triggerRect.top - triggerRect.height >
        panelRect.height + screenMargin
      ) {
        // 下方放得下，放下方
        transformOriginY = 'top';
      } else if (triggerRect.top > panelRect.height + screenMargin) {
        // 上方放得下，放上方
        transformOriginY = 'bottom';
      } else {
        // 上方、下方都放不下，默认房下方
        transformOriginY = 'top';
      }

      if ($window.width() - triggerRect.left > panelRect.width + screenMargin) {
        // 右侧放得下，沿着 trigger 左侧放
        transformOriginX = 'left';
      } else if (
        triggerRect.left + triggerRect.width + screenMargin >
        panelRect.width
      ) {
        // 左侧放得下，沿着 trigger 右侧放
        transformOriginX = 'right';
      } else {
        // 左侧、右侧都放不下，默认沿着 trigger 左侧放
        transformOriginX = 'left';
      }
    } else {
      const [y, x] = this.placement.split('-') as [
        'top' | 'bottom',
        'start' | 'end',
      ];
      transformOriginX = x === 'start' ? 'left' : 'right';
      transformOriginY = y === 'top' ? 'bottom' : 'top';
    }

    $panel.css({
      top:
        transformOriginY === 'top'
          ? triggerRect.top + triggerRect.height
          : triggerRect.top - panelRect.height,
      left:
        transformOriginX === 'left'
          ? triggerRect.left
          : triggerRect.left + triggerRect.width - panelRect.width,
      transformOrigin: [transformOriginX, transformOriginY].join(' '),
    });
  }

  // 这些属性变更时，需要更新样式
  @watch('disabled', true)
  @watch('placement', true)
  @watch('openOnPointer', true)
  protected async onPositionChange() {
    if (this.disabled || !this.open) {
      return;
    }

    // 打开动画开始前，设置 panel 的样式
    this.updatePositioner();
  }

  @watch('open', true)
  protected async onOpenChange() {
    if (this.disabled) {
      this.open = false;
      return;
    }

    const easingLinear = getEasing(this, 'linear');
    const easingEmphasizedDecelerate = getEasing(this, 'emphasized-decelerate');
    const easingEmphasizedAccelerate = getEasing(this, 'emphasized-accelerate');

    if (this.open) {
      const requestOpen = emit(this, 'open', {
        cancelable: true,
      });
      if (requestOpen.defaultPrevented) {
        return;
      }

      // dropdown 打开时，尝试把焦点放到 panel 中
      if (typeof this.panelSlot?.focus === 'function') {
        this.panelSlot.focus();
      }

      const duration = getDuration(this, 'medium4');

      await stopAnimations(this.panel);
      this.panel.hidden = false;
      this.updatePositioner();
      await Promise.all([
        animateTo(
          this.panel,
          [{ transform: 'scaleY(0.45)' }, { transform: 'scaleY(1)' }],
          { duration, easing: easingEmphasizedDecelerate },
        ),
        animateTo(
          this.panel,
          [{ opacity: 0 }, { opacity: 1, offset: 0.125 }, { opacity: 1 }],
          { duration, easing: easingLinear },
        ),
      ]);

      emit(this, 'opened');
    } else {
      const requestClose = emit(this, 'close', {
        cancelable: true,
      });
      if (requestClose.defaultPrevented) {
        return;
      }

      // dropdown 关闭时，如果不支持 focus 触发，且焦点在 dropdown 内，则焦点回到 trigger 上
      if (
        !this.hasTrigger('focus') &&
        typeof this.triggerSlot?.focus === 'function' &&
        (this.contains(document.activeElement) ||
          this.contains(document.activeElement?.assignedSlot ?? null))
      ) {
        this.triggerSlot.focus();
      }

      const duration = getDuration(this, 'short4');

      await stopAnimations(this.panel);
      await Promise.all([
        animateTo(
          this.panel,
          [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.45)' }],
          { duration, easing: easingEmphasizedAccelerate },
        ),
        animateTo(
          this.panel,
          [{ opacity: 1 }, { opacity: 1, offset: 0.875 }, { opacity: 0 }],
          { duration, easing: easingLinear },
        ),
      ]);

      this.panel.hidden = true;

      emit(this, 'closed');
    }
  }

  protected override render(): TemplateResult {
    return html`<div part="trigger" class="trigger">
        <slot name="trigger"></slot>
      </div>
      <div
        part="panel"
        class="panel"
        style="${styleMap({ zIndex: this.zIndex.toString() })}"
      >
        <slot></slot>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-dropdown': Dropdown;
  }
}

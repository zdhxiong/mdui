import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit/directives/style-map.js';
import { animate, AnimateController } from '@lit-labs/motion';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/width.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/static/contains.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import {
  DURATION_FADE_IN,
  DURATION_FADE_OUT,
  EASING_ACCELERATION,
  EASING_DECELERATION,
  KEYFRAME_FADE_IN,
  KEYFRAME_FADE_OUT,
} from '@mdui/shared/helpers/motion.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { watch } from '@mdui/shared/decorators/watch';
import { JQ } from '@mdui/jq/shared/core';
import { style } from './style.js';

/**
 * @event open - dropdown 开始打开时，事件被触发
 * @event opened - dropdown 打开动画完成时，事件被触发
 * @event close - dropdown 开始关闭时，事件被触发
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

  protected get $window(): JQ<Window> {
    return $(window);
  }

  @query('.panel')
  protected panel!: HTMLElement;

  protected readonly animateController = new AnimateController(this, {
    defaultOptions: {
      keyframeOptions: {
        duration: DURATION_FADE_IN,
        easing: EASING_DECELERATION,
      },
      in: KEYFRAME_FADE_IN,
      out: KEYFRAME_FADE_OUT,
      onStart: () => {
        emit(this, this.open ? 'open' : 'close');
      },
      onComplete: () => {
        emit(this, this.open ? 'opened' : 'closed');
      },
    },
  });

  /**
   * dropdown 是否打开
   */
  @property({ type: Boolean, reflect: true })
  public open = false;

  /**
   * 是否禁用 dropdown
   */
  @property({ type: Boolean, reflect: false })
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
   * 通过 hover 触发 dropdown 打开时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true })
  public openDelay = 150;

  /**
   * 通过 hover 触发 dropdown 关闭时的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true })
  public closeDelay = 150;

  /**
   * 是否在触发 dropdown 时的光标所在的位置打开 dropdown。通常用于在打开鼠标右键菜单时使用
   */
  @property({ type: Boolean, reflect: true })
  public openOnPointer = false;

  /**
   * dropdown 下拉内容的 zIndex 的值
   */
  @property({ type: Number, reflect: true })
  public zIndex = 900;

  /**
   * 在 document 上点击时，根据条件判断是否要关闭 dropdown
   */
  protected onOuterClick(e: Event) {
    if (!this.open) {
      return;
    }

    const target = e.target as HTMLElement;

    // 点击 trigger 或 panel 外部区域，直接关闭
    if (
      this.triggerSlot !== target &&
      !$.contains(this.triggerSlot, target) &&
      this.panelSlots
        .map((panelSlot) => {
          return panelSlot !== target && !$.contains(panelSlot, target);
        })
        .every((i) => i)
    ) {
      this.open = false;
    }

    // 当包含 contextmenu 且不包含 click 时，点击 trigger，关闭
    if (
      this.hasTrigger('contextmenu') &&
      !this.hasTrigger('click') &&
      (this.triggerSlot === target || $.contains(this.triggerSlot, target))
    ) {
      this.open = false;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    $(document).on('pointerdown._dropdown', (e) => this.onOuterClick(e));
    $(window).on('scroll._dropdown', () => {
      window.requestAnimationFrame(() => this.onOpenChange());
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(document).off('pointerdown._dropdown');
    $(window).off('scroll._dropdown');
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    $(this.triggerSlots[0]).on({
      focus: () => this.onFocus(),
      blur: () => this.onBlur(),
      click: (e) => this.onClick(e as MouseEvent),
      contextmenu: (e) => this.onContextMenu(e as MouseEvent),
      keydown: (e) => this.onKeydown(e as KeyboardEvent),
      mouseenter: () => this.onMouseEnter(),
      mouseleave: () => this.onMouseLeave(),
    });
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

  protected onBlur() {
    if (!this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = false;
  }

  protected onClick(e: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (e.button || !this.hasTrigger('click')) {
      return;
    }

    this.open = !this.open;
  }

  // 右键菜单点击位置相对于 trigger 的位置
  private contextmenuOffsetX!: number;
  private contextmenuOffsetY!: number;

  protected onContextMenu(e: MouseEvent) {
    if (!this.hasTrigger('contextmenu')) {
      return;
    }

    e.preventDefault();
    this.contextmenuOffsetX = e.offsetX;
    this.contextmenuOffsetY = e.offsetY;
    this.open = true;
  }

  protected onKeydown(e: KeyboardEvent) {
    // 按 Enter 键打开
    if (!this.open && e.key === 'Enter') {
      e.stopPropagation();
      this.open = true;
      return;
    }

    // 按 ECS 键关闭
    if (this.open && e.key === 'Escape') {
      e.stopPropagation();
      this.open = false;
      return;
    }
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

  protected getPanelStyle(): Record<string, string> {
    const triggerRect = this.triggerSlots[0].getBoundingClientRect();
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
        this.$window.width() - triggerRect.left - this.contextmenuOffsetX >
        panelRect.width + screenMargin
      ) {
        // 右侧放得下
        left = triggerRect.left + this.contextmenuOffsetX;
        transformOriginX = 'left';
      } else {
        // 右侧放不下时，放左侧
        left = this.$window.width() - panelRect.width - screenMargin;
        transformOriginX = 'right';
      }

      if (
        this.$window.height() - triggerRect.top - this.contextmenuOffsetY >
        panelRect.height + screenMargin
      ) {
        // 下方放得下
        top = triggerRect.top + this.contextmenuOffsetY;
        transformOriginY = 'top';
      } else if (
        triggerRect.top + this.contextmenuOffsetY >
        panelRect.height + screenMargin
      ) {
        // 上方放得下
        top = triggerRect.top + this.contextmenuOffsetY - panelRect.height;
        transformOriginY = 'bottom';
      } else {
        // 上方、下方都放不下，放在屏幕顶部
        top = screenMargin;
        transformOriginY = 'top';
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        transformOrigin: `${transformOriginX} ${transformOriginY}`,
      };
    }

    // 未指定 openOnPointer，则根据 placement 参数设置打开方位
    let transformOriginX: 'left' | 'right' = 'left';
    let transformOriginY: 'top' | 'bottom' = 'bottom';

    // 自动判断 dropdown 的方位
    if (this.placement === 'auto') {
      if (
        this.$window.height() - triggerRect.top - triggerRect.height >
        panelRect.height + screenMargin
      ) {
        // 下方放得下
        transformOriginY = 'top';
      } else if (triggerRect.top > panelRect.height + screenMargin) {
        // 下方放不下，放上方
        transformOriginY = 'bottom';
      }

      if (
        this.$window.width() - triggerRect.left >
        panelRect.width + screenMargin
      ) {
        // 右侧放得下，沿着 trigger 左侧放
        transformOriginX = 'left';
      } else if (
        triggerRect.left + triggerRect.width + screenMargin >
        panelRect.width
      ) {
        // 左侧放得下，沿着 trigger 右侧放
        transformOriginX = 'right';
      }
    } else {
      const [y, x] = this.placement.split('-') as [
        'top' | 'bottom',
        'start' | 'end',
      ];
      transformOriginX = x === 'start' ? 'left' : 'right';
      transformOriginY = y === 'top' ? 'bottom' : 'top';
    }

    return {
      top: `${
        transformOriginY === 'top'
          ? triggerRect.top + triggerRect.height
          : triggerRect.top - panelRect.height
      }px`,
      left: `${
        transformOriginX === 'left'
          ? triggerRect.left
          : triggerRect.left + triggerRect.width - panelRect.width
      }px`,
      transformOrigin: `${transformOriginX} ${transformOriginY}`,
    };
  }

  @watch('open')
  @watch('disabled')
  @watch('placement')
  @watch('openOnPointer')
  protected async onOpenChange() {
    if (this.disabled || !this.open) {
      return;
    }

    await this.updateComplete;

    // 打开动画开始前，设置 panel 的样式
    const style = this.getPanelStyle();

    $(this.panel).css(style);
  }

  protected override render(): TemplateResult {
    return html`<div part="trigger" class="trigger">
        <slot name="trigger"></slot>
      </div>
      ${when(
        this.open && !this.disabled,
        () => html`<div
          part="panel"
          class="panel"
          style="${styleMap({ zIndex: this.zIndex.toString() })}"
          ${animate({
            keyframeOptions: {
              duration: DURATION_FADE_OUT,
              easing: EASING_ACCELERATION,
            },
          })}
        >
          <slot></slot>
        </div>`,
      )} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-dropdown': Dropdown;
  }
}

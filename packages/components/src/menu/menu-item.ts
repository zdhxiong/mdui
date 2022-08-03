import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
  state,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { animate, AnimateController } from '@lit-labs/motion';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import '@mdui/icons/arrow-right.js';
import '@mdui/icons/check.js';
import { $ } from '@mdui/jq/$.js';
import { JQ } from '@mdui/jq/shared/core.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/width.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/siblings.js';
import '@mdui/jq/methods/parents.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/static/contains.js';
import {
  DURATION_FADE_IN,
  DURATION_FADE_OUT,
  EASING_ACCELERATION,
  EASING_DECELERATION,
  KEYFRAME_FADE_IN,
  KEYFRAME_FADE_OUT,
} from '@mdui/shared/helpers/motion.js';
import { emit } from '@mdui/shared/helpers/event.js';
import type { Menu } from '../menu.js';
import type { MaterialIconsName } from '../icon.js';
import type { Ripple } from '../ripple/index.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { menuItemStyle } from './menu-item-style.js';

/**
 * @event submenu-open - 子菜单开始打开时，事件被触发
 * @event submenu-opened - 子菜单打开动画完成时，事件被触发
 * @event submenu-close - 子菜单开始关闭时，事件被触发
 * @event submenu-closed - 子菜单关闭动画完成时，事件被触发
 *
 * @slot - 菜单项的文本
 * @slot start - 菜单项左侧元素
 * @slot end - 菜单项右侧元素
 * @slot end-text - 菜单右侧的文本
 * @slot submenu - 子菜单
 * @slot custom - 任意自定义内容
 *
 * @csspart start - 左侧的元素
 * @csspart label - 文本内容的容器
 * @csspart label-text 文本内容
 * @csspart end - 右侧的元素
 * @csspart end-text - 右侧的文本
 * @csspart submenu - 子菜单的容器
 */
@customElement('mdui-menu-item')
export class MenuItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  static override styles: CSSResultGroup = [componentStyle, menuItemStyle];

  protected get focusDisabled(): boolean {
    return this.disabled;
  }

  protected get focusElement(): HTMLElement {
    return this;
  }

  protected get rippleDisabled(): boolean {
    return this.disabled;
  }

  @query('mdui-ripple')
  protected rippleElement!: Ripple;

  @query('.submenu')
  protected submenuContainer!: HTMLElement;

  @queryAssignedElements({ slot: 'submenu', flatten: true })
  protected submenuSlots!: Menu[] | null;

  protected get $submenuSlot(): JQ<Menu> {
    return $(this.submenuSlots![0]);
  }

  protected get $window(): JQ<Window> {
    return $(window);
  }

  protected get hasSubmenuSlot(): boolean {
    return this.hasSlotController.test('submenu');
  }

  // selected 属性变化时，是否需要修改父元素的 value 值
  // 在 `selects="single"` 时，选中一个 item 时，会取消选中其他 item，从而多次修改 value 值，导致触发多次 change 事件；
  // 为了确保一次选中只修改一次 value 值，在修改 value 值前，判断该属性为 true 才执行
  private changeParentValueOnSelectedChange = true;

  protected readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'start',
    'end',
    'end-text',
    'submenu',
    'custom',
  );

  protected readonly animateController = new AnimateController(this, {
    defaultOptions: {
      keyframeOptions: {
        duration: DURATION_FADE_IN,
        easing: EASING_DECELERATION,
      },
      in: KEYFRAME_FADE_IN,
      out: KEYFRAME_FADE_OUT,
      onStart: () => {
        emit(this, this.submenuOpen ? 'submenu-open' : 'submenu-close');
      },
      onComplete: () => {
        emit(this, this.submenuOpen ? 'submenu-opened' : 'submenu-closed');
      },
    },
  });

  /**
   * 由父组件 menu 赋值
   */
  @state()
  protected dense!: boolean;

  /**
   * 由父组件 menu 赋值
   */
  @state()
  protected selects!: undefined | 'single' | 'multiple';

  /**
   * 由父组件 menu 赋值
   */
  @state()
  protected submenuTrigger!: string;

  /**
   * 由父组件 menu 赋值
   */
  @state()
  protected submenuOpenDelay!: number;

  /**
   * 由父组件 menu 赋值
   */
  @state()
  protected submenuCloseDelay!: number;

  /**
   * 是否选中该菜单项
   */
  @property({ type: Boolean, reflect: true })
  public selected = false;

  /**
   * 该菜单项的值
   */
  @property({ reflect: true })
  public value!: string;

  /**
   * 是否禁用该菜单项
   */
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 左侧的 Material Icons 图标名
   * 如果需要在左侧留出一个图标的位置，可以传入空字符串进行占位
   */
  @property({ reflect: true })
  public icon!: MaterialIconsName;

  /**
   * 右侧的 Material Icons 图标名
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon!: MaterialIconsName;

  /**
   * 右侧的文本
   */
  @property({ reflect: true, attribute: 'end-text' })
  public endText!: string;

  /**
   * 是否打开子菜单
   */
  @property({ type: Boolean, reflect: true, attribute: 'submenu-open' })
  public submenuOpen = false;

  /**
   * selected 属性变化时
   */
  @watch('selected')
  protected async onSelectedChange() {
    // 如果是单选，选中当前 item 时，取消选中其他 item
    if (this.selects === 'single' && this.selected) {
      $(this)
        .siblings('mdui-menu-item')
        .each(async (_, itemElement: MenuItem) => {
          itemElement.selected = false;

          // 由一个 item 的选中，导致其他 item 被取消选中时，暂时禁止其他 item 修改父元素的 value 值
          itemElement.changeParentValueOnSelectedChange = false;
          await this.updateComplete;
          itemElement.changeParentValueOnSelectedChange = true;
        });
    }

    if (this.changeParentValueOnSelectedChange && this.selects) {
      const menuElement = $(this).parents('mdui-menu')[0] as unknown as Menu;
      // @ts-ignore
      menuElement.syncValueFromItems();
    }
  }

  /**
   * 点击子菜单外面的区域，关闭子菜单
   */
  protected onOuterClick(e: Event) {
    if (
      !this.submenuOpen ||
      this === e.target ||
      $.contains(this, e.target as HTMLElement)
    ) {
      return;
    }

    this.submenuOpen = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    $(document).on('pointerdown._menu-item', (e) => this.onOuterClick(e));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(document).off('pointerdown._menu-item');
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    $(this).on({
      focus: () => this.onFocus(),
      blur: () => this.onBlur(),
      click: (e) => this.onClick(e as MouseEvent),
      keydown: (e) => this.onKeydown(e as KeyboardEvent),
      mouseenter: () => this.onMouseEnter(),
      mouseleave: () => this.onMouseLeave(),
    });
  }

  protected hasTrigger(trigger: string): boolean {
    const triggers = this.submenuTrigger.split(' ');
    return triggers.includes(trigger);
  }

  protected onFocus() {
    if (this.submenuOpen || !this.hasTrigger('focus') || !this.hasSubmenuSlot) {
      return;
    }

    this.submenuOpen = true;
  }

  protected onBlur() {
    if (
      !this.submenuOpen ||
      !this.hasTrigger('focus') ||
      !this.hasSubmenuSlot
    ) {
      return;
    }

    this.submenuOpen = false;
  }

  protected onClick(e: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (e.button) {
      return;
    }

    // 切换 selected 状态
    if (this.selects) {
      this.selected = !this.selected;
    }

    // 切换子菜单打开状态
    if (
      !this.hasTrigger('click') ||
      e.target !== this ||
      !this.hasSubmenuSlot
    ) {
      return;
    }

    this.submenuOpen = !this.submenuOpen;
  }

  protected onKeydown(e: KeyboardEvent) {
    // 按空格键切换选中状态
    if (this.selects && e.key === ' ') {
      this.selected = !this.selected;
      e.preventDefault();
    }

    // 切换子菜单打开状态
    if (!this.hasSubmenuSlot) {
      return;
    }

    if (!this.submenuOpen && e.key === 'Enter') {
      e.stopPropagation();
      this.submenuOpen = true;
    }

    if (this.submenuOpen && e.key === 'Escape') {
      e.stopPropagation();
      this.submenuOpen = false;
    }
  }

  private submenuOpenTimeout!: number;
  private submenuCloseTimeout!: number;

  protected onMouseEnter() {
    // 不做 submenuOpen 的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover') || !this.hasSubmenuSlot) {
      return;
    }

    window.clearTimeout(this.submenuCloseTimeout);
    if (this.submenuOpenDelay) {
      this.submenuOpenTimeout = window.setTimeout(() => {
        this.submenuOpen = true;
      }, this.submenuOpenDelay);
    } else {
      this.submenuOpen = true;
    }
  }

  protected onMouseLeave() {
    // 不做 submenuOpen 的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover') || !this.hasSubmenuSlot) {
      return;
    }

    window.clearTimeout(this.submenuOpenTimeout);
    this.submenuCloseTimeout = window.setTimeout(() => {
      this.submenuOpen = false;
    }, this.submenuCloseDelay || 50);
  }

  protected getSubmenuStyle(): Record<string, string | number> {
    const itemRect = this.getBoundingClientRect();
    const submenuWidth = this.$submenuSlot.innerWidth();
    const submenuHeight = this.$submenuSlot.innerHeight();
    const screenMargin = 8; // 子菜单与屏幕界至少保留 8px 间距

    let placementX: 'top' | 'bottom' = 'bottom';
    let placementY: 'left' | 'right' = 'right';

    // 判断子菜单上下位置
    if (this.$window.height() - itemRect.top > submenuHeight + screenMargin) {
      placementX = 'bottom';
    } else if (itemRect.top + itemRect.height > submenuHeight + screenMargin) {
      placementX = 'top';
    }

    // 判断子菜单左右位置
    if (
      this.$window.width() - itemRect.left - itemRect.width >
      submenuWidth + screenMargin
    ) {
      placementY = 'right';
    } else if (itemRect.left > submenuWidth + screenMargin) {
      placementY = 'left';
    }

    return {
      top: placementX === 'bottom' ? 0 : itemRect.height - submenuHeight,
      left: placementY === 'right' ? itemRect.width : -submenuWidth,
      transformOrigin: `${placementY === 'right' ? 0 : '100%'} ${
        placementX === 'bottom' ? 0 : '100%'
      }`,
    };
  }

  @watch('submenuOpen')
  @watch('disabled')
  protected async onOpenChange() {
    if (this.disabled || !this.submenuOpen) {
      return;
    }

    await this.updateComplete;

    // 打开子菜单动画开始前，设置子菜单的样式
    const submenuStyle = this.getSubmenuStyle();

    $(this.submenuContainer).css(submenuStyle);
  }

  protected renderInner(
    hasCustomSlot: boolean,
    hasSubmenuSlot: boolean,
  ): TemplateResult {
    if (hasCustomSlot) {
      return html`<slot name="custom"></slot>`;
    }

    const hasStartSlot = this.hasSlotController.test('start');
    const hasEndSlot = this.hasSlotController.test('end');
    const hasEndTextSlot = this.hasSlotController.test('end-text');

    return html`<div
        part="start"
        class="start-icon ${classMap({
          'has-start':
            hasStartSlot ||
            this.icon !== undefined ||
            this.selects === 'single' ||
            this.selects === 'multiple',
        })}"
      >
        ${this.selected
          ? html`<mdui-icon-check></mdui-icon-check>`
          : html`<slot name="start">
              <mdui-icon name=${this.icon}></mdui-icon>
            </slot>`}
      </div>
      <div part="label" class="label">
        <div part="label-text" class="label-text"><slot></slot></div>
      </div>
      <div
        part="end-text"
        class="end-text ${classMap({
          'has-end-text': hasEndTextSlot || this.endText,
        })}"
      >
        <slot name="end-text">${this.endText}</slot>
      </div>
      <div
        part="end"
        class="end-icon ${classMap({
          'has-end': hasEndSlot || this.endIcon || hasSubmenuSlot,
        })}"
      >
        ${hasSubmenuSlot && !hasEndSlot && !this.endIcon
          ? html`<mdui-icon-arrow-right></mdui-icon-arrow-right>`
          : html`<slot name="end">
              <mdui-icon name=${this.endIcon}></mdui-icon>
            </slot>`}
      </div>`;
  }

  protected override render(): TemplateResult {
    const { disabled, href } = this;
    const hasCustomSlot = this.hasSlotController.test('custom');
    const hasSubmenuSlot = this.hasSubmenuSlot;
    const className =
      'item' + (hasCustomSlot ? '' : ' preset') + (this.dense ? ' dense' : '');

    return html`<mdui-ripple></mdui-ripple>${href && !disabled
        ? // @ts-ignore
          this.renderAnchor({
            className,
            content: this.renderInner(hasCustomSlot, this.hasSubmenuSlot),
          })
        : html`<div class=${className}>
            ${this.renderInner(hasCustomSlot, hasSubmenuSlot)}
          </div>`}${when(
        this.submenuOpen && !this.disabled && hasSubmenuSlot,
        () =>
          html`<div
            part="submenu"
            class="submenu"
            ${animate({
              keyframeOptions: {
                duration: DURATION_FADE_OUT,
                easing: EASING_ACCELERATION,
              },
            })}
          >
            <slot name="submenu"></slot>
          </div>`,
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu-item': MenuItem;
  }
}

import { html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import cc from 'classcat';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/parent.js';
import '@mdui/jq/methods/width.js';
import '@mdui/jq/static/contains.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '@mdui/icons/arrow-right.js';
import '@mdui/icons/check.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { menuItemStyle } from './menu-item-style.js';
import type { MaterialIconsName } from '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';

/**
 * @event submenu-open - 子菜单开始打开时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单打开
 * @event submenu-opened - 子菜单打开动画完成时，事件被触发
 * @event submenu-close - 子菜单开始关闭时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单关闭
 * @event submenu-closed - 子菜单关闭动画完成时，事件被触发
 *
 * @slot - 菜单项的文本
 * @slot start - 菜单项左侧元素
 * @slot end - 菜单项右侧元素
 * @slot end-text - 菜单右侧的文本
 * @slot submenu-item - 子菜单
 * @slot custom - 任意自定义内容
 *
 * @csspart start - 左侧的元素
 * @csspart label - 文本内容的容器
 * @csspart label-text 文本内容
 * @csspart end - 右侧的元素
 * @csspart end-text - 右侧的文本
 * @csspart submenu - 子菜单元素
 */
@customElement('mdui-menu-item')
export class MenuItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  static override styles: CSSResultGroup = [componentStyle, menuItemStyle];

  private readonly rippleRef: Ref<Ripple> = createRef();

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  @query('.item')
  private readonly item!: HTMLElement;

  @query('.submenu')
  private readonly submenu!: HTMLElement;

  // 由 mdui-menu 控制该参数
  @state() protected dense!: boolean;

  // 由 mdui-menu 控制该参数
  @state() protected selects!: undefined | 'single' | 'multiple';

  // 由 mdui-menu 控制该参数
  @state() protected submenuTrigger!: string;

  // 由 mdui-menu 控制该参数
  @state() protected submenuOpenDelay!: number;

  // 由 mdui-menu 控制该参数
  @state() protected submenuCloseDelay!: number;

  // 是否已选中该菜单项，由 mdui-menu 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  protected selected = false;

  // 是否可聚焦。由 mdui-menu 控制该参数
  @state() protected focusable = false;

  private get hasSubmenu(): boolean {
    return this.hasSlotController.test('submenu-item');
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || !this.focusable;
  }

  protected override get focusElement(): HTMLElement {
    return this.href ? this.item : this;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  // 每一个 menu-item 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'start',
    'end',
    'end-text',
    'submenu-item',
    'custom',
  );

  /**
   * 该菜单项的值
   */
  @property({ reflect: true })
  public value = '';

  /**
   * 是否禁用该菜单项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
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
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
    attribute: 'submenu-open',
  })
  public submenuOpen = false;

  public override connectedCallback(): void {
    super.connectedCallback();
    $(document).on('pointerdown._menu-item', (e) => this.onOuterClick(e));

    // 如果该菜单项是子菜单项，添加 slot
    if ($(this).parent().is('mdui-menu-item')) {
      this.slot = 'submenu-item';
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(document).off('pointerdown._menu-item');
  }

  /**
   * 点击子菜单外面的区域，关闭子菜单
   */
  private onOuterClick(event: Event) {
    if (
      !this.submenuOpen ||
      this === event.target ||
      $.contains(this, event.target as HTMLElement)
    ) {
      return;
    }

    this.submenuOpen = false;
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    $(this).on({
      focus: () => this.onFocus(),
      blur: () => this.onBlur(),
      click: (e) => this.onClick(e as MouseEvent),
      keydown: (e) => this.onKeydown(e as KeyboardEvent),
      mouseenter: () => this.onMouseEnter(),
      mouseleave: () => this.onMouseLeave(),
    });

    if (this.submenu) {
      this.submenu.hidden =
        !this.submenuOpen || this.disabled || !this.hasSubmenu;
    }
  }

  private hasTrigger(trigger: string): boolean {
    const triggers = this.submenuTrigger.split(' ');
    return triggers.includes(trigger);
  }

  private onFocus() {
    if (this.submenuOpen || !this.hasTrigger('focus') || !this.hasSubmenu) {
      return;
    }

    this.submenuOpen = true;
  }

  private onBlur() {
    if (!this.submenuOpen || !this.hasTrigger('focus') || !this.hasSubmenu) {
      return;
    }

    this.submenuOpen = false;
  }

  private onClick(event: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (event.button) {
      return;
    }

    // 切换子菜单打开状态
    if (
      !this.hasTrigger('click') ||
      event.target !== this ||
      !this.hasSubmenu
    ) {
      return;
    }

    this.submenuOpen = !this.submenuOpen;
  }

  private onKeydown(event: KeyboardEvent) {
    // 切换子菜单打开状态
    if (this.hasSubmenu) {
      if (!this.submenuOpen && event.key === 'Enter') {
        event.stopPropagation();
        this.submenuOpen = true;
      }

      if (this.submenuOpen && event.key === 'Escape') {
        event.stopPropagation();
        this.submenuOpen = false;
      }
    }
  }

  private submenuOpenTimeout!: number;
  private submenuCloseTimeout!: number;

  private onMouseEnter() {
    // 不做 submenuOpen 的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover') || !this.hasSubmenu) {
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

  private onMouseLeave() {
    // 不做 submenuOpen 的判断，因为可以延时打开和关闭
    if (!this.hasTrigger('hover') || !this.hasSubmenu) {
      return;
    }

    window.clearTimeout(this.submenuOpenTimeout);
    this.submenuCloseTimeout = window.setTimeout(() => {
      this.submenuOpen = false;
    }, this.submenuCloseDelay || 50);
  }

  private updateSubmenuPositioner(): void {
    const $window = $(window);
    const $submenu = $(this.submenu);
    const itemRect = this.getBoundingClientRect();
    const submenuWidth = $submenu.innerWidth();
    const submenuHeight = $submenu.innerHeight();
    const screenMargin = 8; // 子菜单与屏幕界至少保留 8px 间距

    let placementX: 'top' | 'bottom' = 'bottom';
    let placementY: 'left' | 'right' = 'right';

    // 判断子菜单上下位置
    if ($window.height() - itemRect.top > submenuHeight + screenMargin) {
      placementX = 'bottom';
    } else if (itemRect.top + itemRect.height > submenuHeight + screenMargin) {
      placementX = 'top';
    }

    // 判断子菜单左右位置
    if (
      $window.width() - itemRect.left - itemRect.width >
      submenuWidth + screenMargin
    ) {
      placementY = 'right';
    } else if (itemRect.left > submenuWidth + screenMargin) {
      placementY = 'left';
    }

    $(this.submenu).css({
      top: placementX === 'bottom' ? 0 : itemRect.height - submenuHeight,
      left: placementY === 'right' ? itemRect.width : -submenuWidth,
      transformOrigin: [
        placementY === 'right' ? 0 : '100%',
        placementX === 'bottom' ? 0 : '100%',
      ].join(' '),
    });
  }

  @watch('submenuOpen', true)
  private async onOpenChange() {
    if (this.disabled) {
      this.submenuOpen = false;
      return;
    }

    const easingLinear = getEasing(this, 'linear');
    const easingEmphasizedDecelerate = getEasing(this, 'emphasized-decelerate');
    const easingEmphasizedAccelerate = getEasing(this, 'emphasized-accelerate');

    if (this.submenuOpen) {
      const requestOpen = emit(this, 'submenu-open', {
        cancelable: true,
      });
      if (requestOpen.defaultPrevented) {
        return;
      }

      const duration = getDuration(this, 'medium4');

      await stopAnimations(this.submenu);
      this.submenu.hidden = false;
      this.updateSubmenuPositioner();
      await Promise.all([
        animateTo(
          this.submenu,
          [{ transform: 'scaleY(0.45)' }, { transform: 'scaleY(1)' }],
          { duration, easing: easingEmphasizedDecelerate },
        ),
        animateTo(
          this.submenu,
          [{ opacity: 0 }, { opacity: 1, offset: 0.125 }, { opacity: 1 }],
          { duration, easing: easingLinear },
        ),
      ]);

      emit(this, 'submenu-opened');
    } else {
      const requestClose = emit(this, 'submenu-close', {
        cancelable: true,
      });
      if (requestClose.defaultPrevented) {
        return;
      }

      const duration = getDuration(this, 'short4');

      await stopAnimations(this.submenu);
      await Promise.all([
        animateTo(
          this.submenu,
          [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.45)' }],
          { duration, easing: easingEmphasizedAccelerate },
        ),
        animateTo(
          this.submenu,
          [{ opacity: 1 }, { opacity: 1, offset: 0.875 }, { opacity: 0 }],
          { duration, easing: easingLinear },
        ),
      ]);

      this.submenu.hidden = true;
      emit(this, 'submenu-closed');
    }
  }

  private renderInner(hasSubmenu: boolean): TemplateResult {
    const hasStartSlot = this.hasSlotController.test('start');
    const hasEndSlot = this.hasSlotController.test('end');
    const hasEndTextSlot = this.hasSlotController.test('end-text');

    return html`<slot name="custom">
      <div
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
          'has-end': hasEndSlot || this.endIcon || hasSubmenu,
        })}"
      >
        ${hasSubmenu && !hasEndSlot && !this.endIcon
          ? html`<mdui-icon-arrow-right></mdui-icon-arrow-right>`
          : html`<slot name="end">
              <mdui-icon name=${this.endIcon}></mdui-icon>
            </slot>`}
      </div>
    </slot>`;
  }

  protected override render(): TemplateResult {
    const hasCustomSlot = this.hasSlotController.test('custom');
    const hasSubmenu = this.hasSubmenu;
    const className = cc({
      item: true,
      preset: !hasCustomSlot,
      dense: this.dense,
    });

    return html`<mdui-ripple ${ref(this.rippleRef)}></mdui-ripple>${this.href &&
      !this.disabled
        ? this.renderAnchor({
            className,
            content: this.renderInner(this.hasSubmenu),
          })
        : html`<div class=${className}>${this.renderInner(hasSubmenu)}</div>`}
      ${when(
        hasSubmenu,
        () =>
          html`<div part="submenu" class="submenu">
            <slot name="submenu-item"></slot>
          </div>`,
      )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu-item': MenuItem;
  }
}

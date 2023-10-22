import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import cc from 'classcat';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/width.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';
import '@mdui/jq/static/contains.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import '@mdui/shared/icons/arrow-right.js';
import '@mdui/shared/icons/check.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { menuItemStyle } from './menu-item-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @summary 菜单项组件
 *
 * ```html
 * <mdui-menu>
 * ..<mdui-menu-item>Item 1</mdui-menu-item>
 * ..<mdui-menu-item>Item 2</mdui-menu-item>
 * </mdui-menu>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event submenu-open - 子菜单开始打开时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单打开
 * @event submenu-opened - 子菜单打开动画完成时，事件被触发
 * @event submenu-close - 子菜单开始关闭时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单关闭
 * @event submenu-closed - 子菜单关闭动画完成时，事件被触发
 *
 * @slot - 菜单项的文本
 * @slot icon - 菜单项左侧图标
 * @slot end-icon - 菜单项右侧图标
 * @slot end-text - 菜单右侧的文本
 * @slot selected-icon - 选中状态的图标
 * @slot submenu - 子菜单
 * @slot custom - 任意自定义内容
 *
 * @csspart container - 菜单项的容器
 * @csspart icon - 左侧的图标
 * @csspart label - 文本内容
 * @csspart end-icon - 右侧的图标
 * @csspart end-text - 右侧的文本
 * @csspart selected-icon - 选中状态的图标
 * @csspart submenu - 子菜单元素
 */
@customElement('mdui-menu-item')
export class MenuItem extends AnchorMixin(
  RippleMixin(FocusableMixin(LitElement)),
) {
  public static override styles: CSSResultGroup = [
    componentStyle,
    menuItemStyle,
  ];

  /**
   * 该菜单项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * 是否禁用该菜单项
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
   *
   * 如果需要在左侧留出一个图标的位置，可以传入空字符串进行占位
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
   */
  @property({ reflect: true, attribute: 'end-icon' })
  public endIcon?: string;

  /**
   * 右侧的文本。也可以通过 `slot="end-text"` 设置
   */
  @property({ reflect: true, attribute: 'end-text' })
  public endText?: string;

  /**
   * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
   */
  @property({ reflect: true, attribute: 'selected-icon' })
  public selectedIcon?: string;

  /**
   * 是否打开子菜单
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
    attribute: 'submenu-open',
  })
  public submenuOpen = false;

  // 是否已选中该菜单项。由 <mdui-menu> 控制该参数
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected selected = false;

  // 是否使用更紧凑的布局。由 <mdui-menu> 控制该参数
  @state()
  protected dense = false;

  // 可选中状态。由 <mdui-menu> 控制该参数
  @state()
  protected selects?: 'single' | 'multiple';

  // 子菜单的触发方式。由 <mdui-menu> 控制该参数
  @state()
  protected submenuTrigger?: string;

  // 通过 hover 触发子菜单打开时的延时。由 <mdui-menu> 控制该参数
  @state()
  protected submenuOpenDelay?: number;

  // 通过 hover 触发子菜单关闭时的延时。由 <mdui-menu> 控制该参数
  @state()
  protected submenuCloseDelay?: number;

  // 是否可聚焦。由 <mdui-menu> 控制该参数
  @state()
  protected focusable = false;

  // 每一个 menu-item 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private submenuOpenTimeout!: number;
  private submenuCloseTimeout!: number;
  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly containerRef: Ref<HTMLElement> = createRef();
  private readonly submenuRef: Ref<HTMLElement> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'icon',
    'end-icon',
    'end-text',
    'submenu',
    'custom',
  );
  private readonly definedController = new DefinedController(this, {
    relatedElements: [''],
  });

  public constructor() {
    super();

    this.onOuterClick = this.onOuterClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  protected override get focusDisabled(): boolean {
    return this.disabled || !this.focusable;
  }

  protected override get focusElement(): HTMLElement {
    return this.href && !this.disabled ? this.containerRef.value! : this;
  }

  protected override get rippleDisabled(): boolean {
    return this.disabled;
  }

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  private get hasSubmenu(): boolean {
    return this.hasSlotController.test('submenu');
  }

  @watch('submenuOpen')
  private async onOpenChange() {
    const hasUpdated = this.hasUpdated;

    // 默认为关闭状态。因此首次渲染时，且为关闭状态，不执行
    if (!this.submenuOpen && !hasUpdated) {
      return;
    }

    await this.definedController.whenDefined();

    if (!hasUpdated) {
      await this.updateComplete;
    }

    const easingLinear = getEasing(this, 'linear');
    const easingEmphasizedDecelerate = getEasing(this, 'emphasized-decelerate');
    const easingEmphasizedAccelerate = getEasing(this, 'emphasized-accelerate');

    // 打开
    // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
    if (this.submenuOpen) {
      if (hasUpdated) {
        const requestOpen = emit(this, 'submenu-open', {
          cancelable: true,
        });
        if (requestOpen.defaultPrevented) {
          return;
        }
      }

      const duration = getDuration(this, 'medium4');

      await stopAnimations(this.submenuRef.value!);
      this.submenuRef.value!.hidden = false;
      this.updateSubmenuPositioner();
      await Promise.all([
        animateTo(
          this.submenuRef.value!,
          [{ transform: 'scaleY(0.45)' }, { transform: 'scaleY(1)' }],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingEmphasizedDecelerate,
          },
        ),
        animateTo(
          this.submenuRef.value!,
          [{ opacity: 0 }, { opacity: 1, offset: 0.125 }, { opacity: 1 }],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingLinear,
          },
        ),
      ]);

      if (hasUpdated) {
        emit(this, 'submenu-opened');
      }
    } else {
      const requestClose = emit(this, 'submenu-close', {
        cancelable: true,
      });
      if (requestClose.defaultPrevented) {
        return;
      }

      const duration = getDuration(this, 'short4');

      await stopAnimations(this.submenuRef.value!);
      await Promise.all([
        animateTo(
          this.submenuRef.value!,
          [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0.45)' }],
          { duration, easing: easingEmphasizedAccelerate },
        ),
        animateTo(
          this.submenuRef.value!,
          [{ opacity: 1 }, { opacity: 1, offset: 0.875 }, { opacity: 0 }],
          { duration, easing: easingLinear },
        ),
      ]);

      if (this.submenuRef.value) {
        this.submenuRef.value.hidden = true;
      }

      emit(this, 'submenu-closed');
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    this.definedController.whenDefined().then(() => {
      document.addEventListener('pointerdown', this.onOuterClick);
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    document.removeEventListener('pointerdown', this.onOuterClick);
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    this.definedController.whenDefined().then(() => {
      this.addEventListener('focus', this.onFocus);
      this.addEventListener('blur', this.onBlur);
      this.addEventListener('click', this.onClick);
      this.addEventListener('keydown', this.onKeydown);
      this.addEventListener('mouseenter', this.onMouseEnter);
      this.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  protected override render(): TemplateResult {
    const hasSubmenu = this.hasSubmenu;
    const hasCustomSlot = this.hasSlotController.test('custom');
    const hasEndIconSlot = this.hasSlotController.test('end-icon');
    const useDefaultEndIcon = !this.endIcon && hasSubmenu && !hasEndIconSlot;
    const hasEndIcon = this.endIcon || hasSubmenu || hasEndIconSlot;

    const hasIcon =
      !isUndefined(this.icon) ||
      this.selects === 'single' ||
      this.selects === 'multiple' ||
      this.hasSlotController.test('icon');

    const hasEndText =
      !!this.endText || this.hasSlotController.test('end-text');

    const className = cc({
      container: true,
      dense: this.dense,
      preset: !hasCustomSlot,
      'has-icon': hasIcon,
      'has-end-text': hasEndText,
      'has-end-icon': hasEndIcon,
    });

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      ${this.href && !this.disabled
        ? this.renderAnchor({
            part: 'container',
            className,
            content: this.renderInner(useDefaultEndIcon, hasIcon),
            refDirective: ref(this.containerRef),
            tabIndex: this.focusable ? 0 : -1,
          })
        : html`<div
            part="container"
            ${ref(this.containerRef)}
            class=${className}
          >
            ${this.renderInner(useDefaultEndIcon, hasIcon)}
          </div>`}
      ${when(
        hasSubmenu,
        () =>
          html`<slot
            name="submenu"
            ${ref(this.submenuRef)}
            part="submenu"
            class="submenu"
            hidden
          ></slot>`,
      )}`;
  }

  /**
   * 点击子菜单外面的区域，关闭子菜单
   */
  private onOuterClick(event: Event) {
    if (
      !this.disabled &&
      this.submenuOpen &&
      this !== event.target &&
      !$.contains(this, event.target as HTMLElement)
    ) {
      this.submenuOpen = false;
    }
  }

  private hasTrigger(trigger: string): boolean {
    return this.submenuTrigger
      ? this.submenuTrigger.split(' ').includes(trigger)
      : false;
  }

  private onFocus() {
    if (
      this.disabled ||
      this.submenuOpen ||
      !this.hasTrigger('focus') ||
      !this.hasSubmenu
    ) {
      return;
    }

    this.submenuOpen = true;
  }

  private onBlur() {
    if (
      this.disabled ||
      !this.submenuOpen ||
      !this.hasTrigger('focus') ||
      !this.hasSubmenu
    ) {
      return;
    }

    this.submenuOpen = false;
  }

  private onClick(event: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (this.disabled || event.button) {
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

    // 支持 hover 和 focus 触发时，点击菜单项不关闭子菜单
    if (
      this.submenuOpen &&
      (this.hasTrigger('hover') || this.hasTrigger('focus'))
    ) {
      return;
    }

    this.submenuOpen = !this.submenuOpen;
  }

  private onKeydown(event: KeyboardEvent) {
    // 切换子菜单打开状态
    if (this.disabled || !this.hasSubmenu) {
      return;
    }

    if (!this.submenuOpen && event.key === 'Enter') {
      event.stopPropagation();
      this.submenuOpen = true;
    }

    if (this.submenuOpen && event.key === 'Escape') {
      event.stopPropagation();
      this.submenuOpen = false;
    }
  }

  private onMouseEnter() {
    // 不做 submenuOpen 的判断，因为可以延时打开和关闭
    if (this.disabled || !this.hasTrigger('hover') || !this.hasSubmenu) {
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
    if (this.disabled || !this.hasTrigger('hover') || !this.hasSubmenu) {
      return;
    }

    window.clearTimeout(this.submenuOpenTimeout);
    this.submenuCloseTimeout = window.setTimeout(() => {
      this.submenuOpen = false;
    }, this.submenuCloseDelay || 50);
  }

  // 更新子菜单的位置
  private updateSubmenuPositioner(): void {
    const $window = $(window);
    const $submenu = $(this.submenuRef.value!);
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

    $(this.submenuRef.value!).css({
      top: placementX === 'bottom' ? 0 : itemRect.height - submenuHeight,
      left: placementY === 'right' ? itemRect.width : -submenuWidth,
      transformOrigin: [
        placementY === 'right' ? 0 : '100%',
        placementX === 'bottom' ? 0 : '100%',
      ].join(' '),
    });
  }

  private renderInner(
    useDefaultEndIcon: boolean,
    hasIcon: boolean,
  ): TemplateResult {
    return html`<slot name="custom">
      ${this.selected
        ? html`<slot
            name="selected-icon"
            part="selected-icon"
            class="selected-icon"
          >
            ${this.selectedIcon
              ? html`<mdui-icon
                  name=${this.selectedIcon}
                  class="i"
                ></mdui-icon>`
              : html`<mdui-icon-check class="i"></mdui-icon-check>`}
          </slot>`
        : html`<slot name="icon" part="icon" class="icon">
            ${hasIcon
              ? html`<mdui-icon name=${this.icon} class="i"></mdui-icon>`
              : nothingTemplate}
          </slot>`}
      <div class="label-container">
        <slot part="label" class="label"></slot>
      </div>
      <slot name="end-text" part="end-text" class="end-text">
        ${this.endText}
      </slot>
      ${useDefaultEndIcon
        ? html`<mdui-icon-arrow-right
            part="end-icon"
            class="end-icon arrow-right"
          ></mdui-icon-arrow-right>`
        : html`<slot name="end-icon" part="end-icon" class="end-icon">
            ${this.endIcon
              ? html`<mdui-icon name=${this.endIcon}></mdui-icon>`
              : nothingTemplate}
          </slot>`}
    </slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-menu-item': MenuItem;
  }
}

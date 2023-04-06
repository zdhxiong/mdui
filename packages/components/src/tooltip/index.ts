import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/width.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event open - tooltip 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 tooltip 打开
 * @event opened - tooltip 显示动画完成时，事件被触发
 * @event close - tooltip 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 tooltip 关闭
 * @event closed - tooltip 隐藏动画完成时，事件被触发
 *
 * @slot - tooltip 触发的目标元素，仅 default slot 中的第一个元素会作为目标元素
 * @slot content - tooltip 的内容，可以包含 HTML。若只包含纯文本，可以使用 content 属性代替
 *
 * @csspart content - tooltip 的内容
 */
@customElement('mdui-tooltip')
export class Tooltip extends LitElement {
  public static override styles: CSSResultGroup = [componentStyle, style];

  /**
   * tooltip 的位置。可选值为：
   * * `auto`：自动判断位置
   * * `top-start`：位于上方，且左对齐
   * * `top`：位于上方，且居中对齐
   * * `top-end`：位于上方，且右对齐
   * * `bottom-start`：位于下方，且左对齐
   * * `bottom`：位于下方，且居中对齐
   * * `bottom-end`：位于下方，且右对齐
   * * `left-start`：位于左侧，且顶部对齐
   * * `left`：位于左侧，且居中对齐
   * * `left-end`：位于左侧，且底部对齐
   * * `right-start`：位于右侧，且顶部对齐
   * * `right`：位于右侧，且居中对齐
   * * `right-end`：位于右侧，且底部对齐
   */
  @property({ reflect: true })
  public placement:
    | 'auto' /*自动判断位置*/
    | 'top-start' /*位于上方，且左对齐*/
    | 'top' /*位于上方，且居中对齐*/
    | 'top-end' /*位于上方，且右对齐*/
    | 'bottom-start' /*位于下方，且左对齐*/
    | 'bottom' /*位于下方，且居中对齐*/
    | 'bottom-end' /*位于下方，且右对齐*/
    | 'left-start' /*位于左侧，且顶部对齐*/
    | 'left' /*位于左侧，且居中对齐*/
    | 'left-end' /*位于左侧，且底部对齐*/
    | 'right-start' /*位于右侧，且顶部对齐*/
    | 'right' /*位于右侧，且居中对齐*/
    | 'right-end' /*位于右侧，且底部对齐*/ = 'auto';

  /**
   * hover 触发显示的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'open-delay' })
  public openDelay = 150;

  /**
   * hover 触发隐藏的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true, attribute: 'close-delay' })
  public closeDelay = 0;

  /**
   * tooltip 的内容
   */
  @property({ reflect: true })
  public content!: string;

  /**
   * 触发方式，支持传入多个值，用空格分隔。可选值为：
   * * `click`
   * * `hover`
   * * `focus`
   * * `manual`：使用了该值时，只能使用编程方式打开和关闭 tooltip，且不能再指定其他触发方式
   */
  @property({ reflect: true })
  public trigger:
    | 'click' /*鼠标点击触发*/
    | 'hover' /*鼠标悬浮触发*/
    | 'focus' /*聚焦时触发*/
    | 'manual' /*通过编程方式触发*/
    | 'click hover'
    | 'click focus'
    | 'hover focus'
    | 'click hover focus' = 'hover focus';

  /**
   * 是否禁用 tooltip
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public disabled = false;

  /**
   * 是否显示 tooltip
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public open = false;

  private target!: HTMLElement;
  private hoverTimeout!: number;
  private readonly tooltipRef: Ref<HTMLElement> = createRef();

  public constructor() {
    super();

    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  @watch('placement', true)
  @watch('content', true)
  private async onPositionChange() {
    if (this.open) {
      this.updatePositioner();
    }
  }

  @watch('open')
  private async onOpenChange() {
    const hasUpdated = this.hasUpdated;

    const duration = getDuration(this, 'short4');
    const easing = getEasing(this, 'standard');

    // 打开
    // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
    if (this.open) {
      if (!hasUpdated) {
        await this.updateComplete;
      }

      if (hasUpdated) {
        const requestOpen = emit(this, 'open', {
          cancelable: true,
        });
        if (requestOpen.defaultPrevented) {
          return;
        }
      }

      await stopAnimations(this.tooltipRef.value!);
      this.tooltipRef.value!.hidden = false;
      this.updatePositioner();
      await animateTo(
        this.tooltipRef.value!,
        [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        {
          duration: hasUpdated ? duration : 0,
          easing,
        },
      );

      if (hasUpdated) {
        emit(this, 'opened');
      }

      return;
    }

    // 关闭
    if (!this.open && hasUpdated) {
      const requestClose = emit(this, 'close', {
        cancelable: true,
      });
      if (requestClose.defaultPrevented) {
        return;
      }

      await stopAnimations(this.tooltipRef.value!);
      await animateTo(
        this.tooltipRef.value!,
        [{ transform: 'scale(1)' }, { transform: 'scale(0)' }],
        { duration, easing },
      );
      this.tooltipRef.value!.hidden = true;
      emit(this, 'closed');
      return;
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener('scroll', this.onWindowScroll);
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('scroll', this.onWindowScroll);
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.target = this.getTarget();

    this.target.addEventListener('focus', this.onFocus);
    this.target.addEventListener('blur', this.onBlur);
    this.target.addEventListener('pointerdown', this.onClick);
    this.target.addEventListener('keydown', this.onKeydown);
    this.target.addEventListener('mouseenter', this.onMouseEnter);
    this.target.addEventListener('mouseleave', this.onMouseLeave);
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>
      <div ${ref(this.tooltipRef)} class="tooltip" hidden>
        <div class="content" part="content">
          <slot name="content">${this.content}</slot>
        </div>
      </div>`;
  }

  /**
   * 获取第一个非 <style> 和 content slot 的子元素，作为 tooltip 的目标元素
   */
  private getTarget(): HTMLElement {
    return [...(this.children as unknown as HTMLElement[])].find(
      (el) =>
        el.tagName.toLowerCase() !== 'style' &&
        el.getAttribute('slot') !== 'content',
    )!;
  }

  private hasTrigger(trigger: string): boolean {
    const triggers = this.trigger.split(' ');
    return triggers.includes(trigger);
  }

  private onFocus() {
    if (this.disabled || this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = true;
  }

  private onBlur() {
    if (this.disabled || !this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = false;
  }

  private onClick(e: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (this.disabled || e.button || !this.hasTrigger('click')) {
      return;
    }

    this.open = !this.open;
  }

  private onKeydown(e: KeyboardEvent) {
    if (this.disabled || !this.open || e.key !== 'Escape') {
      return;
    }

    e.stopPropagation();
    this.open = false;
  }

  private onMouseEnter() {
    if (this.disabled || this.open || !this.hasTrigger('hover')) {
      return;
    }

    if (this.openDelay) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = window.setTimeout(() => {
        this.open = true;
      }, this.openDelay);
    } else {
      this.open = true;
    }
  }

  private onMouseLeave() {
    window.clearTimeout(this.hoverTimeout);

    if (this.disabled || !this.open || !this.hasTrigger('hover')) {
      return;
    }

    // 同时使用 hover focus 时，leave 比 focus 先触发，导致 leave 后触发 focus，而显示 tooltip
    // 所以延迟执行 leave
    this.hoverTimeout = window.setTimeout(() => {
      this.open = false;
    }, this.closeDelay || 50);
  }

  private onWindowScroll() {
    window.requestAnimationFrame(() => this.updatePositioner());
  }

  private updatePositioner(): void {
    const $tooltip = $(this.tooltipRef.value!);
    const targetRect = this.target.getBoundingClientRect(); // 触发目标的位置和宽高
    const tooltipRect = {
      width: this.tooltipRef.value!.offsetWidth,
      height: this.tooltipRef.value!.offsetHeight,
    }; // tooltip 的宽高
    const targetMargin = 8; // 触发目标和 tooltip 之间的间距

    let transformOriginX: 'left' | 'right' | 'center';
    let transformOriginY: 'top' | 'bottom' | 'center';
    let top: number;
    let left: number;
    let placement = this.placement;

    // 自动判断 tooltip 方位
    // 优先级为 top>bottom>left>right
    if (placement === 'auto') {
      if (targetRect.top > tooltipRect.height + targetMargin) {
        // 上方放得下，放上方
        placement = 'top';
      } else if (
        $(window).height() - targetRect.top - targetRect.height >
        tooltipRect.height + targetMargin
      ) {
        // 下方放得下，放下方
        placement = 'bottom';
      } else if (targetRect.left > tooltipRect.width + targetMargin) {
        // 左侧放得下，放左侧
        placement = 'left';
      } else if (
        $(window).width() - targetRect.left - targetRect.width >
        tooltipRect.width + targetMargin
      ) {
        // 右侧放得下，放右侧
        placement = 'right';
      } else {
        // 默认放上方
        placement = 'top';
      }
    }

    // 根据 placement 计算 tooltip 的位置和方向
    const [position, alignment] = placement.split('-') as [
      'top' | 'bottom' | 'left' | 'right',
      'start' | 'end' | undefined,
    ];

    switch (position) {
      case 'top':
        transformOriginY = 'bottom';
        top = targetRect.top - tooltipRect.height - targetMargin;
        break;
      case 'bottom':
        transformOriginY = 'top';
        top = targetRect.top + targetRect.height + targetMargin;
        break;
      default:
        transformOriginY = 'center';
        switch (alignment) {
          case 'start':
            top = targetRect.top;
            break;
          case 'end':
            top = targetRect.top + targetRect.height - tooltipRect.height;
            break;
          default:
            top =
              targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
            break;
        }
        break;
    }

    switch (position) {
      case 'left':
        transformOriginX = 'right';
        left = targetRect.left - tooltipRect.width - targetMargin;
        break;
      case 'right':
        transformOriginX = 'left';
        left = targetRect.left + targetRect.width + targetMargin;
        break;
      default:
        transformOriginX = 'center';
        switch (alignment) {
          case 'start':
            left = targetRect.left;
            break;
          case 'end':
            left = targetRect.left + targetRect.width - tooltipRect.width;
            break;
          default:
            left =
              targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
            break;
        }
        break;
    }

    $tooltip.css({
      top,
      left,
      transformOrigin: [transformOriginX, transformOriginY].join(' '),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tooltip': Tooltip;
  }
}

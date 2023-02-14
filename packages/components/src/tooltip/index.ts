import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/width.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
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
   * tooltip 的方位。可选值为：
   * * `auto`
   * * `top`
   * * `bottom`
   * * `left`
   * * `right`
   */
  @property({ reflect: true })
  public placement:
    | 'auto' /*自动判断位置。默认在下方。优先级为 `top` > `bottom` > `left` > `right`*/
    | 'top'
    | 'bottom'
    | 'left'
    | 'right' = 'auto';

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
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public disabled = false;

  /**
   * 是否显示 tooltip
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean =>
      value !== null && value !== 'false',
  })
  public open = false;

  /**
   * tooltip 的 zIndex 的值
   */
  @property({ type: Number, reflect: true, attribute: 'z-index' })
  public zIndex = 1000;

  private target!: HTMLElement;
  private hoverTimeout!: number;
  private readonly tooltipRef: Ref<HTMLElement> = createRef();

  @watch('disabled', true)
  @watch('placement', true)
  @watch('content', true)
  private async onPositionChange() {
    if (this.disabled || !this.open) {
      return;
    }

    // 打开动画开始前，设置 tooltip 的样式
    this.updatePositioner();
  }

  @watch('open', true)
  private async onOpenChange() {
    if (this.disabled) {
      this.open = false;
      return;
    }

    if (this.open) {
      const requestOpen = emit(this, 'open', {
        cancelable: true,
      });
      if (requestOpen.defaultPrevented) {
        return;
      }

      await stopAnimations(this.tooltipRef.value!);
      this.tooltipRef.value!.hidden = false;
      this.updatePositioner();
      await animateTo(
        this.tooltipRef.value!,
        [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        {
          duration: getDuration(this, 'short4'),
          easing: getEasing(this, 'standard'),
        },
      );
      emit(this, 'opened');
    } else {
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
        {
          duration: getDuration(this, 'short4'),
          easing: getEasing(this, 'standard'),
        },
      );
      this.tooltipRef.value!.hidden = true;
      emit(this, 'closed');
    }
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    $(window).on('scroll._tooltip', () => {
      window.requestAnimationFrame(() => this.onOpenChange());
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    $(window).off('scroll._tooltip');
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.target = this.getTarget();

    $(this.target).on({
      focus: () => this.onFocus(),
      blur: () => this.onBlur(),
      pointerdown: (e) => this.onClick(e as MouseEvent),
      keydown: (e) => this.onKeydown(e as KeyboardEvent),
      mouseenter: () => this.onMouseEnter(),
      mouseleave: () => this.onMouseLeave(),
    });

    this.tooltipRef.value!.hidden = !this.open || this.disabled;
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>
      <div
        ${ref(this.tooltipRef)}
        class="tooltip"
        style="${styleMap({ zIndex: this.zIndex.toString() })}"
      >
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
    if (this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = true;
  }

  private onBlur() {
    if (!this.open || !this.hasTrigger('focus')) {
      return;
    }

    this.open = false;
  }

  private onClick(e: MouseEvent) {
    // e.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
    if (e.button || !this.hasTrigger('click')) {
      return;
    }

    this.open = !this.open;
  }

  private onKeydown(e: KeyboardEvent) {
    if (!this.open || e.key !== 'Escape') {
      return;
    }

    e.stopPropagation();
    this.open = false;
  }

  private onMouseEnter() {
    if (this.open || !this.hasTrigger('hover')) {
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

    if (!this.open || !this.hasTrigger('hover')) {
      return;
    }

    // 同时使用 hover focus 时，leave 比 focus 先触发，导致 leave 后触发 focus，而显示 tooltip
    // 所以延迟执行 leave
    this.hoverTimeout = window.setTimeout(() => {
      this.open = false;
    }, this.closeDelay || 50);
  }

  private updatePositioner(): void {
    const $tooltip = $(this.tooltipRef.value!);
    const targetRect = this.target.getBoundingClientRect(); // 触发目标的位置和宽高
    const tooltipRect = {
      width: this.tooltipRef.value!.offsetWidth,
      height: this.tooltipRef.value!.offsetHeight,
    }; // tooltip 的宽高
    const targetMargin = 4; // 触发目标和 tooltip 之间的间距

    let placement = this.placement;
    // 自动判断 tooltip 方位
    if (this.placement === 'auto') {
      if (targetMargin + tooltipRect.height < targetRect.top) {
        placement = 'top';
      } else if (
        targetMargin + tooltipRect.height + targetRect.top + targetRect.height <
        $(window).height()
      ) {
        placement = 'bottom';
      } else if (targetMargin + tooltipRect.width < targetRect.left) {
        placement = 'left';
      } else if (
        targetMargin + tooltipRect.width + targetRect.width <
        $(window).width() - targetRect.left
      ) {
        placement = 'right';
      } else {
        placement = 'bottom';
      }
    }

    // 获取位置
    switch (placement) {
      case 'bottom':
        $tooltip.css({
          transformOrigin: 'top center',
          top: `${targetRect.top + targetRect.height + targetMargin}px`,
          left: `${
            targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
          }px`,
        });
        break;
      case 'top':
        $tooltip.css({
          transformOrigin: 'bottom center',
          top: `${targetRect.top - tooltipRect.height - targetMargin}px`,
          left: `${
            targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
          }px`,
        });
        break;
      case 'left':
        $tooltip.css({
          transformOrigin: 'center right',
          top: `${
            targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
          }px`,
          left: `${targetRect.left - tooltipRect.width - targetMargin}px`,
        });
        break;
      default:
        $tooltip.css({
          transformOrigin: 'center left',
          top: `${
            targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
          }px`,
          left: `${targetRect.left + targetRect.width + targetMargin}px`,
        });
        break;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tooltip': Tooltip;
  }
}

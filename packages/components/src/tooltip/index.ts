import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { animate } from '@lit-labs/motion';
import { componentStyle } from '@mdui/shared/src/lit-styles/component-style';
import { watch } from '@mdui/shared/decorators/watch.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/width.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/css.js';
import { emit } from '@mdui/shared/src/helpers/event';
import { Easing } from '@mdui/shared/src/helpers/motion';
import { style } from './style.js';

/**
 * @event open - tooltip 开始显示时，事件被触发
 * @event opened - tooltip 显示动画完成时，事件被触发
 * @event close - tooltip 开始隐藏时，事件被触发
 * @event closed - tooltip 隐藏动画完成时，事件被触发
 *
 * @slot - tooltip 触发的目标元素，仅 default slot 中的第一个元素会作为目标元素
 * @slot content - tooltip 的内容，可以包含 HTML。若只包含纯文本，可以使用 content 属性代替
 *
 * @csspart content - tooltip 的内容
 * @csspart arrow - tooltip 中的箭头
 */
@customElement('mdui-tooltip')
export class Tooltip extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  @query('.tooltip')
  protected tooltip!: HTMLElement;

  @query('.arrow')
  protected arrow!: HTMLElement;

  protected target!: HTMLElement;

  private hoverTimeout!: number;

  /**
   * tooltip 的位置。可选值为：
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
  @property({ type: Number, reflect: true })
  public openDelay = 150;

  /**
   * hover 触发隐藏的延时，单位为毫秒
   */
  @property({ type: Number, reflect: true })
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
   * * `manual`：使用了该值时，只能使用编程方式打开和关闭tooltip，且不能再指定其他触发方式
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
  @property({ type: Boolean, reflect: true })
  public disabled = false;

  /**
   * 是否显示 tooltip
   */
  @property({ type: Boolean, reflect: true })
  public open = false;

  /**
   * tooltip 的 zIndex 的值
   */
  @property({ type: Number, reflect: true })
  public zIndex = 1000;

  public connectedCallback() {
    super.connectedCallback();
    $(window).on('scroll._tooltip', () => {
      window.requestAnimationFrame(() => this.onOpenChange());
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    $(window).off('scroll._tooltip');
  }

  protected firstUpdated() {
    this.target = this.getTarget();

    $(this.target).on({
      focus: () => this.onFocus(),
      blur: () => this.onBlur(),
      pointerdown: (e) => this.onClick(e as MouseEvent),
      keydown: (e) => this.onKeydown(e as KeyboardEvent),
      mouseenter: () => this.onMouseEnter(),
      mouseleave: () => this.onMouseLeave(),
    });
  }

  /**
   * 获取第一个非 <style> 和 content slot 的子元素，作为 tooltip 的目标元素
   */
  protected getTarget(): HTMLElement {
    return [...(this.children as unknown as HTMLElement[])].find(
      (el) =>
        el.tagName.toLowerCase() !== 'style' &&
        el.getAttribute('slot') !== 'content',
    )!;
  }

  protected hasTrigger(trigger: string): boolean {
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

  protected onKeydown(e: KeyboardEvent) {
    if (!this.open || e.key !== 'Escape') {
      return;
    }

    e.stopPropagation();
    this.open = false;
  }

  protected onMouseEnter() {
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

  protected onMouseLeave() {
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

  protected getStyle(): Record<'tooltip' | 'arrow', Record<string, string>> {
    const targetRect = this.target.getBoundingClientRect(); // 触发目标的位置和宽高
    const tooltipRect = {
      width: this.tooltip.offsetWidth,
      height: this.tooltip.offsetHeight,
    }; // tooltip 的宽高
    const arrowRect = {
      width: this.arrow.offsetWidth,
      height: this.arrow.offsetHeight,
    }; // arrow 的宽高
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
        return {
          tooltip: {
            transformOrigin: 'top center',
            top: `${targetRect.top + targetRect.height + targetMargin}px`,
            left: `${
              targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
            }px`,
          },
          arrow: {
            top: '6px',
            left: `${tooltipRect.width / 2 - arrowRect.width / 2}px`,
          },
        };
      case 'top':
        return {
          tooltip: {
            transformOrigin: 'bottom center',
            top: `${targetRect.top - tooltipRect.height - targetMargin}px`,
            left: `${
              targetRect.left + targetRect.width / 2 - tooltipRect.width / 2
            }px`,
          },
          arrow: {
            bottom: '6px',
            left: `${tooltipRect.width / 2 - arrowRect.width / 2}px`,
          },
        };
      case 'left':
        return {
          tooltip: {
            transformOrigin: 'center right',
            top: `${
              targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
            }px`,
            left: `${targetRect.left - tooltipRect.width - targetMargin}px`,
          },
          arrow: {
            right: '6px',
            top: `${tooltipRect.height / 2 - arrowRect.height / 2}px`,
          },
        };
      default:
        return {
          tooltip: {
            transformOrigin: 'center left',
            top: `${
              targetRect.top + targetRect.height / 2 - tooltipRect.height / 2
            }px`,
            left: `${targetRect.left + targetRect.width + targetMargin}px`,
          },
          arrow: {
            left: '6px',
            top: `${tooltipRect.height / 2 - arrowRect.height / 2}px`,
          },
        };
    }
  }

  @watch('open')
  @watch('disabled')
  @watch('placement')
  @watch('content')
  private async onOpenChange() {
    if (this.disabled || !this.open) {
      return;
    }

    await this.updateComplete;

    // 打开动画开始前，设置 tooltip 的样式
    const style = this.getStyle();

    $(this.tooltip).css(style.tooltip);
    $(this.arrow).css(style.arrow);
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>
      ${when(
        this.open && !this.disabled,
        () => html`<div
          class="tooltip"
          style="${styleMap({ zIndex: this.zIndex.toString() })}"
          ${animate({
            keyframeOptions: {
              duration: 100,
            },
            in: [{ transform: 'scale(0)', easing: Easing.DECELERATION }],
            out: [
              { transform: 'scale(1)', easing: Easing.ACCELERATION },
              { transform: 'scale(0)' },
            ],
            onStart: () => {
              emit(this, this.open ? 'open' : 'close');
            },
            onComplete: () => {
              emit(this, this.open ? 'opened' : 'closed');
            },
          })}
        >
          <div class="arrow" part="arrow"></div>
          <div class="content" part="content">
            <slot name="content">${this.content}</slot>
          </div>
        </div>`,
      )} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tooltip': Tooltip;
  }
}

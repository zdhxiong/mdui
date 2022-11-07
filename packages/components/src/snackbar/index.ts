import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/on.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { getBreakpoint } from '@mdui/shared/helpers/breakpoint.js';
import { emit } from '@mdui/shared/helpers/event.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import '@mdui/icons/clear.js';
import '../button-icon.js';
import '../button.js';
import { style } from './style.js';
import type { CSSResultGroup, TemplateResult } from 'lit';

/**
 * @event open - Snackbar 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 显示
 * @event opened - Snackbar 显示动画完成时，事件被触发
 * @event close - Snackbar 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 关闭
 * @event closed - Snackbar 隐藏动画完成时，事件被触发
 * @event click - 点击 Snackbar 时触发
 * @event action-click - 点击操作按钮时触发
 *
 * @slot - Snackbar 中的消息文本内容
 * @slot action - 右侧的操作按钮
 * @slot close - 右侧的关闭按钮。必须设置 `closeable` 属性为 `true` 才会显示该按钮
 *
 * @csspart message - 消息文本的容器
 * @csspart action-group - 右侧的操作按钮和关闭按钮的容器
 * @csspart action - 操作按钮
 * @csspart close - 关闭按钮
 *
 * @cssprop --shape-corner 圆角大小。可以指定一个具体的像素值；但更推荐[引用系统变量]()
 */
@customElement('mdui-snackbar')
export class Snackbar extends LitElement {
  static override styles: CSSResultGroup = [componentStyle, style];

  private closeTimeout!: number;

  /**
   * 是否显示 Snackbar
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public open = false;

  /**
   * Snackbar 出现的位置。可选值为：
   * * `top`：位于顶部，居中对齐
   * * `top-start`：位于顶部，左对齐
   * * `top-end`：位于顶部，右对齐
   * * `bottom`：位于底部，居中对齐
   * * `bottom-start`：位于底部，左对齐
   * * `bottom-end`：位于底部，右对齐
   */
  @property({ reflect: true })
  public placement:
    | 'top' /*位于顶部，居中对齐*/
    | 'top-start' /*位于顶部，左对齐*/
    | 'top-end' /*位于顶部，右对齐*/
    | 'bottom' /*位于底部，居中对齐*/
    | 'bottom-start' /*位于底部，左对齐*/
    | 'bottom-end' /*位于底部，右对齐*/ = 'bottom';

  /**
   * 操作按钮的文本
   */
  @property({ reflect: true, attribute: 'action' })
  public action!: string;

  /**
   * 是否在右侧显示关闭按钮
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: (value: string | null): boolean => value !== 'false',
  })
  public closeable = false;

  /**
   * 消息文本最多显示几行。默认不限制行数。可选值为
   * * `1`：消息文本最多显示一行
   * * `2`：消息文本最多显示两行
   */
  @property({ type: Number, reflect: true, attribute: 'message-line' })
  public messageLine!: 1 | 2;

  /**
   * 在多长时间后自动关闭（单位为毫秒）。设置为 0 时，不自动关闭
   */
  @property({ type: Number, reflect: true, attribute: 'auto-close-delay' })
  public autoCloseDelay = 5000;

  /**
   * 点击操作按钮时是否关闭 Snackbar
   */
  @property({
    type: Boolean,
    reflect: true,
    attribute: 'close-on-action-click',
    converter: (value: string | null): boolean => value !== 'false',
  })
  public closeOnActionClick = false;

  /**
   * 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar
   */
  @property({
    type: Boolean,
    reflect: true,
    attribute: 'close-on-outside-click',
    converter: (value: string | null): boolean => value !== 'false',
  })
  public closeOnOutsideClick = false;

  override connectedCallback() {
    super.connectedCallback();

    $(document).on('pointerdown._snackbar', (e) =>
      this.onDocumentClick(e as PointerEvent),
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();

    $(document).off('pointerdown._snackbar');
  }

  /**
   * 在 document 上点击时，根据条件判断是否要关闭 snackbar
   */
  private onDocumentClick(e: PointerEvent) {
    if (!this.open || !this.closeOnOutsideClick) {
      return;
    }

    const target = e.target as HTMLElement;

    if (!this.contains(target) && this !== target) {
      this.open = false;
    }
  }

  @watch('open')
  protected async onOpenChange() {
    const isHandset = getBreakpoint() === 'handset';
    const isCenteredHorizontally = ['top', 'bottom'].includes(this.placement);

    const easingLinear = getEasing(this, 'linear');
    const easingEmphasizedDecelerate = getEasing(this, 'emphasized-decelerate');

    const children = Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>('.message, .action-group'),
    );

    // 手机上始终使用全宽的样式，但 @media 选择器中无法使用 CSS 变量，所以使用 js 来设置样式
    const commonStyle = isHandset
      ? { left: '1rem', right: '1rem', minWidth: 0 }
      : isCenteredHorizontally
      ? { left: '50%' }
      : {};

    // 打开
    // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
    if (this.open) {
      const hasUpdated = this.hasUpdated;
      if (!hasUpdated) {
        await this.updateComplete;
      }

      if (hasUpdated) {
        const requestOpen = emit(this, 'open', { cancelable: true });
        if (requestOpen.defaultPrevented) {
          return;
        }
      }

      window.clearTimeout(this.closeTimeout);
      if (this.autoCloseDelay) {
        this.closeTimeout = window.setTimeout(() => {
          this.open = false;
        }, this.autoCloseDelay);
      }

      this.style.display = 'flex';
      await Promise.all([
        stopAnimations(this),
        ...children.map((child) => stopAnimations(child)),
      ]);

      const duration = getDuration(this, 'medium4');

      const getOpenStyle = (ident: 'start' | 'end') => {
        const scaleY = `scaleY(${ident === 'start' ? 0 : 1})`;

        if (isHandset) {
          return { transform: scaleY };
        } else {
          return {
            transform: [
              scaleY,
              isCenteredHorizontally ? 'translateX(-50%)' : '',
            ]
              .filter((i) => i)
              .join(' '),
          };
        }
      };

      await Promise.all([
        animateTo(
          this,
          [
            { ...getOpenStyle('start'), ...commonStyle },
            { ...getOpenStyle('end'), ...commonStyle },
          ],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingEmphasizedDecelerate,
            fill: 'forwards',
          },
        ),
        animateTo(
          this,
          [{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }],
          {
            duration: hasUpdated ? duration : 0,
            easing: easingLinear,
            fill: 'forwards',
          },
        ),
        ...children.map((child) =>
          animateTo(
            child,
            [
              { opacity: 0 },
              { opacity: 0, offset: 0.2 },
              { opacity: 1, offset: 0.8 },
              { opacity: 1 },
            ],
            {
              duration: hasUpdated ? duration : 0,
              easing: easingLinear,
            },
          ),
        ),
      ]);

      if (hasUpdated) {
        emit(this, 'opened');
      }

      return;
    }

    // 关闭
    if (!this.open && this.hasUpdated) {
      const requestClose = emit(this, 'close', { cancelable: true });
      if (requestClose.defaultPrevented) {
        return;
      }

      window.clearTimeout(this.closeTimeout);

      await Promise.all([
        stopAnimations(this),
        ...children.map((child) => stopAnimations(child)),
      ]);

      const duration = getDuration(this, 'short4');

      const getCloseStyle = (ident: 'start' | 'end') => {
        const opacity = ident === 'start' ? 1 : 0;
        const styles = { opacity };

        if (!isHandset && isCenteredHorizontally) {
          Object.assign(styles, { transform: 'translateX(-50%)' });
        }

        return styles;
      };

      await Promise.all([
        animateTo(
          this,
          [
            { ...getCloseStyle('start'), ...commonStyle },
            { ...getCloseStyle('end'), ...commonStyle },
          ],
          {
            duration,
            easing: easingLinear,
            fill: 'forwards',
          },
        ),
        ...children.map((child) =>
          animateTo(
            child,
            [{ opacity: 1 }, { opacity: 0, offset: 0.75 }, { opacity: 0 }],
            { duration, easing: easingLinear },
          ),
        ),
      ]);

      this.style.display = 'none';
      emit(this, 'closed');
      return;
    }
  }

  private onActionClick() {
    emit(this, 'action-click');

    if (this.closeOnActionClick) {
      this.open = false;
    }
  }

  private onCloseClick() {
    this.open = false;
  }

  protected override render(): TemplateResult {
    return html`<div part="message" class="message">
        <slot></slot>
      </div>
      <div part="action-group" class="action-group">
        <div part="action" class="action" @click=${this.onActionClick}>
          <slot name="action">
            ${when(
              this.action,
              () =>
                html`<mdui-button variant="text">${this.action}</mdui-button>`,
            )}
          </slot>
        </div>
        ${when(
          this.closeable,
          () => html`<div
            part="close"
            class="close"
            @click=${this.onCloseClick}
          >
            <slot name="close">
              <mdui-button-icon>
                <mdui-icon-clear></mdui-icon-clear>
              </mdui-button-icon>
            </slot>
          </div>`,
        )}
      </div>`;
  }
}
